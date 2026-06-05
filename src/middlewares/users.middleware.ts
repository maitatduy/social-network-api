import { checkSchema } from "express-validator";
import { validate } from "./validation.middleware";
import usersService from "~/services/users.service";
import { ErrorWithStatus } from "~/models/errors/Error";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { USERS_MESSAGES } from "~/constants/messages";
import databaseService from "~/services/database.service";
import { hashPassword } from "~/utils/crypto";

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
                normalizeEmail: true,
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
                normalizeEmail: true,
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
