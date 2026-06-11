import { checkSchema } from "express-validator";
import { validate } from "./validation.middleware";
import usersService from "~/services/users.service";
import { ErrorWithStatus } from "~/models/errors/Error";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { USERS_MESSAGES } from "~/constants/messages";
import databaseService from "~/services/database.service";
import { hashPassword } from "~/utils/crypto";
import { verifyToken } from "~/utils/jwt";
import { TokenType, UserVerifyStatus } from "~/constants/enum";
import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";

export const registerValidator = validate(
    checkSchema(
        {
            name: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
                },
                isString: true,
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: USERS_MESSAGES.NAME_LENGTH,
                },
                trim: true,
            },
            email: {
                notEmpty: {
                    errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED,
                },
                isEmail: {
                    errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID,
                },
                trim: true,
                custom: {
                    options: async (value) => {
                        const emailExists = await usersService.checkEmailExists(value);
                        if (emailExists) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
                                status: HTTP_STATUS.CONFLICT,
                            });
                        }
                        return true;
                    },
                },
            },
            password: {
                notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
                isLength: {
                    options: { min: 6, max: 50 },
                    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH,
                },
                isStrongPassword: {
                    options: {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    },
                    errorMessage: USERS_MESSAGES.PASSWORD_IS_WEAK,
                },
            },
            confirm_password: {
                notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
                custom: {
                    options: (value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH);
                        }
                        return true;
                    },
                },
            },
            date_of_birth: {
                isISO8601: {
                    options: {
                        strict: true,
                        strictSeparator: true,
                    },
                    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_IS_INVALID,
                },
            },
        },
        ["body"],
    ),
);

export const loginValidator = validate(
    checkSchema(
        {
            email: {
                notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
                isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
                trim: true,
                custom: {
                    options: async (value, { req }) => {
                        const user = await databaseService.users.findOne({
                            email: value,
                            password: hashPassword(req.body.password),
                        });
                        if (!user) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                        req.user = user;
                        return true;
                    },
                },
            },
            password: {
                notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
                isLength: {
                    options: { min: 6, max: 50 },
                    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH,
                },
            },
        },
        ["body"],
    ),
);

export const accessTokenValidator = validate(
    checkSchema(
        {
            Authorization: {
                notEmpty: { errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED },
                custom: {
                    options: async (value, { req }) => {
                        const access_token = value.split(" ")[1]; // Bearer <token>
                        if (!access_token) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }

                        try {
                            const decoded = await verifyToken({ token: access_token });
                            if (decoded.token_type !== TokenType.AccessToken) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            req.decoded_authorization = decoded;
                        } catch (err) {
                            if (err instanceof ErrorWithStatus) {
                                throw err;
                            }
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }

                        return true;
                    },
                },
            },
        },
        ["headers"],
    ),
);

export const refreshTokenValidator = validate(
    checkSchema(
        {
            refresh_token: {
                notEmpty: { errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED },
                custom: {
                    options: async (value, { req }) => {
                        try {
                            const [decoded, token] = await Promise.all([
                                verifyToken({ token: value }),
                                databaseService.refreshTokens.findOne({ token: value }),
                            ]);

                            // Kiểm tra token_type
                            if (decoded.token_type !== TokenType.RefreshToken) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            if (!token) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.REFRESH_TOKEN_NOT_FOUND,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            req.decoded_refresh_token = decoded;
                        } catch (err) {
                            if (err instanceof ErrorWithStatus) throw err;
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }

                        return true;
                    },
                },
            },
        },
        ["body"],
    ),
);

export const verifyEmailValidator = validate(
    checkSchema(
        {
            email_verify_token: {
                trim: true,
                notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED },
                custom: {
                    options: async (value, { req }) => {
                        try {
                            const decoded = await verifyToken({ token: value });

                            // Kiểm tra token_type
                            if (decoded.token_type !== TokenType.EmailVerifyToken) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            // Tìm user theo user_id trong payload
                            const user = await databaseService.users.findOne({
                                _id: new ObjectId(decoded.user_id),
                            });

                            if (!user) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            // Email đã verify rồi
                            if (user.verify === UserVerifyStatus.Verified) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED,
                                    status: HTTP_STATUS.OK,
                                });
                            }

                            // Token không khớp với token đang lưu trong DB
                            if (user.email_verify_token !== value) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            req.decoded_email_verify_token = decoded;
                        } catch (err) {
                            if (err instanceof ErrorWithStatus) throw err;
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }

                        return true;
                    },
                },
            },
        },
        ["body"],
    ),
);

export const resendVerifyEmailValidator = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { user_id } = req.decoded_authorization!;

    const user = await databaseService.users.findOne({
        _id: new ObjectId(user_id),
    });

    if (!user) {
        return next(
            new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND,
            }),
        );
    }

    if (user.verify === UserVerifyStatus.Verified) {
        return next(
            new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED,
                status: HTTP_STATUS.OK,
            }),
        );
    }

    next();
};

export const forgotPasswordValidator = validate(
    checkSchema(
        {
            email: {
                notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
                isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
                trim: true,
                custom: {
                    options: async (value, { req }) => {
                        const user = await databaseService.users.findOne({ email: value });
                        if (!user) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.USER_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND,
                            });
                        }
                        req.user = user;
                        return true;
                    },
                },
            },
        },
        ["body"],
    ),
);

export const verifyForgotPasswordTokenValidator = validate(
    checkSchema(
        {
            forgot_password_token: {
                trim: true,
                notEmpty: { errorMessage: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED },
                custom: {
                    options: async (value, { req }) => {
                        try {
                            const decoded = await verifyToken({ token: value });

                            if (decoded.token_type !== TokenType.ForgotPasswordToken) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            const user = await databaseService.users.findOne({
                                _id: new ObjectId(decoded.user_id),
                            });

                            if (!user) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.USER_NOT_FOUND,
                                    status: HTTP_STATUS.NOT_FOUND,
                                });
                            }

                            if (user.forgot_password_token !== value) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID,
                                    status: HTTP_STATUS.UNAUTHORIZED,
                                });
                            }

                            req.decoded_forgot_password_token = decoded;
                        } catch (err) {
                            if (err instanceof ErrorWithStatus) throw err;
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID,
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }

                        return true;
                    },
                },
            },
        },
        ["body"],
    ),
);

export const resetPasswordValidator = validate(
    checkSchema(
        {
            password: {
                notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
                isLength: {
                    options: { min: 6, max: 50 },
                    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH,
                },
                isStrongPassword: {
                    options: {
                        minLength: 6,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    },
                    errorMessage: USERS_MESSAGES.PASSWORD_IS_WEAK,
                },
            },
            confirm_password: {
                notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
                custom: {
                    options: (value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH);
                        }
                        return true;
                    },
                },
            },
        },
        ["body"],
    ),
);

export const verifiedUserValidator = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.decoded_authorization!;

    const user = await databaseService.users.findOne({
        _id: new ObjectId(user_id as string),
    });

    if (!user) {
        return next(
            new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND,
            }),
        );
    }

    if (user.verify !== UserVerifyStatus.Verified) {
        return next(
            new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_VERIFIED,
                status: HTTP_STATUS.FORBIDDEN,
            }),
        );
    }

    next();
};

export const updateMeValidator = validate(
    checkSchema(
        {
            name: {
                optional: true,
                notEmpty: {
                    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
                },
                isString: true,
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: USERS_MESSAGES.NAME_LENGTH,
                },
                trim: true,
            },
            date_of_birth: {
                optional: true,
                isISO8601: {
                    options: { strict: true, strictSeparator: true },
                    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_IS_INVALID,
                },
            },
            bio: {
                optional: true,
                isString: true,
                isLength: {
                    options: { min: 1, max: 200 },
                    errorMessage: USERS_MESSAGES.BIO_LENGTH,
                },
                trim: true,
            },
            avatar: {
                optional: true,
                isString: true,
                isURL: {
                    errorMessage: USERS_MESSAGES.AVATAR_IS_INVALID,
                },
                trim: true,
            },
        },
        ["body"],
    ),
);

export const getUserProfileValidator = validate(
    checkSchema(
        {
            username: {
                trim: true,
                notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_IS_INVALID },
                isString: true,
                custom: {
                    options: async (value) => {
                        const user = await databaseService.users.findOne({ username: value });
                        if (!user) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.USER_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND,
                            });
                        }
                        return true;
                    },
                },
            },
        },
        ["params"],
    ),
);

export const followValidator = validate(
    checkSchema(
        {
            followed_user_id: {
                trim: true,
                notEmpty: { errorMessage: USERS_MESSAGES.FOLLOWED_USER_ID_IS_REQUIRED },
                custom: {
                    options: async (value, { req }) => {
                        // Kiểm tra có phải ObjectId hợp lệ không
                        if (!ObjectId.isValid(value)) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.FOLLOWED_USER_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND,
                            });
                        }

                        // Không thể follow chính mình
                        const { user_id } = req.decoded_authorization!;

                        if (value === user_id) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.CANNOT_FOLLOW_YOURSELF,
                                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                            });
                        }

                        // Kiểm tra user muốn follow có tồn tại không
                        const followedUser = await databaseService.users.findOne({
                            _id: new ObjectId(value),
                        });

                        if (!followedUser) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.FOLLOWED_USER_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND,
                            });
                        }

                        // Kiểm tra user muốn follow đã xác thực chưa
                        if (followedUser.verify === UserVerifyStatus.Unverified) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.CANNOT_FOLLOW_UNVERIFIED_USER,
                                status: HTTP_STATUS.FORBIDDEN,
                            });
                        }
                        return true;
                    },
                },
            },
        },
        ["body"],
    ),
);
