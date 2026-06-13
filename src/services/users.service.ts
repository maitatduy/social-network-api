import User from "~/models/database/User";
import { RegisterReqBody, UpdateMeReqBody } from "~/models/requests/User.request";
import databaseService from "./database.service";
import { decodeToken, signToken } from "~/utils/jwt";
import { TokenType, UserVerifyStatus } from "~/constants/enum";
import { StringValue } from "ms";
import { hashPassword } from "~/utils/crypto";
import RefreshToken from "~/models/database/RefreshToken";
import { ObjectId } from "mongodb";
import { ErrorWithStatus } from "~/models/errors/Error";
import { USERS_MESSAGES } from "~/constants/messages";
import { HTTP_STATUS } from "~/constants/httpStatus";
import Follower from "~/models/database/Follower";

class UserService {
    async register(payload: RegisterReqBody) {
        const user_id = new ObjectId();

        const email_verify_token = await this.signEmailVerifyToken(user_id.toString());

        const user = new User({
            ...payload,
            _id: user_id,
            username: `user_${user_id}`,
            date_of_birth: new Date(payload.date_of_birth),
            password: hashPassword(payload.password),
            email_verify_token,
        });

        await databaseService.users.insertOne(user);

        // TODO: gửi email chứa email_verify_token
        console.log("email_verify_token:", email_verify_token);

        // Ký cả 2 token song song
        const [access_token, refresh_token] = await Promise.all([
            this.signAccessToken(user_id.toString()),
            this.signRefreshToken(user_id.toString()),
        ]);

        await this.saveRefreshToken(user_id.toString(), refresh_token);

        return { access_token, refresh_token };
    }

    async login(user_id: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.signAccessToken(user_id),
            this.signRefreshToken(user_id),
        ]);

        await this.saveRefreshToken(user_id, refresh_token);

        return { access_token, refresh_token };
    }

    async logout(refresh_token: string) {
        await databaseService.refreshTokens.deleteOne({ token: refresh_token });
    }

    async checkEmailExists(email: string) {
        const user = await databaseService.users.findOne({
            email,
        });
        return Boolean(user);
    }

    private signAccessToken(user_id: string) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.AccessToken,
            },
            options: {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
                algorithm: "HS256",
            },
        });
    }

    private signRefreshToken(user_id: string) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.RefreshToken,
            },
            options: {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue,
                algorithm: "HS256",
            },
        });
    }

    private signForgotPasswordToken(user_id: string) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.ForgotPasswordToken,
            },
            options: {
                expiresIn: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue,
                algorithm: "HS256",
            },
        });
    }

    private async saveRefreshToken(user_id: string, refresh_token: string) {
        const { iat, exp } = decodeToken(refresh_token);
        await databaseService.refreshTokens.insertOne(
            new RefreshToken({
                token: refresh_token,
                user_id: new ObjectId(user_id),
                iat,
                exp,
            }),
        );
    }

    async refreshToken(user_id: string, old_refresh_token: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.signAccessToken(user_id),
            this.signRefreshToken(user_id),
            databaseService.refreshTokens.deleteOne({ token: old_refresh_token }),
        ]);

        await this.saveRefreshToken(user_id, refresh_token);

        return { access_token, refresh_token };
    }

    async verifyEmail(user_id: string) {
        await databaseService.users.updateOne(
            {
                _id: new ObjectId(user_id),
            },
            {
                $set: {
                    verify: UserVerifyStatus.Verified,
                    email_verify_token: "",
                },
                $currentDate: {
                    updated_at: true,
                }, // MongoDB tự cập nhật thời gian
            },
        );

        const [access_token, refresh_token] = await Promise.all([
            this.signAccessToken(user_id),
            this.signRefreshToken(user_id),
        ]);

        await this.saveRefreshToken(user_id, refresh_token);

        return { access_token, refresh_token };
    }

    private signEmailVerifyToken(user_id: string) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.EmailVerifyToken,
            },
            options: {
                expiresIn: process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue,
            },
        });
    }

    async resendVerifyEmail(user_id: string) {
        const email_verify_token = await this.signEmailVerifyToken(user_id);

        console.log("email_verify_token mới:", email_verify_token);

        await databaseService.users.updateOne(
            {
                _id: new ObjectId(user_id),
            },
            {
                $set: {
                    email_verify_token,
                },
                $currentDate: {
                    updated_at: true,
                },
            },
        );
    }

    async forgotPassword(user_id: string) {
        const forgot_password_token = await this.signForgotPasswordToken(user_id);

        await databaseService.users.updateOne(
            {
                _id: new ObjectId(user_id),
            },
            {
                $set: {
                    forgot_password_token,
                },
                $currentDate: {
                    updated_at: true,
                },
            },
        );

        // TODO: Gửi email
        console.log("forgot_password_token:", forgot_password_token);
    }

    async resetPassword(user_id: string, password: string) {
        await databaseService.users.updateOne(
            {
                _id: new ObjectId(user_id),
            },
            {
                $set: {
                    password: hashPassword(password),
                },
                $currentDate: {
                    updated_at: true,
                },
            },
        );
    }

    async getMe(user_id: string) {
        return databaseService.users.findOne(
            {
                _id: new ObjectId(user_id),
            },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0,
                },
            },
        );
    }

    async updateMe(user_id: string, payload: UpdateMeReqBody) {
        const { date_of_birth, ...rest } = payload;

        const updateData = {
            ...rest,
            ...(date_of_birth && {
                date_of_birth: new Date(date_of_birth),
            }),
        };

        const result = await databaseService.users.findOneAndUpdate(
            { _id: new ObjectId(user_id) },
            {
                $set: updateData,
                $currentDate: { updated_at: true },
            },
            {
                returnDocument: "after",
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0,
                },
            },
        );

        return result;
    }

    async getUserProfile(username: string) {
        return databaseService.users.findOne(
            { username },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0,
                    verify: 0,
                },
            },
        );
    }

    async follow(user_id: string, followed_user_id: string) {
        const existingFollow = await databaseService.followers.findOne({
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id),
        });

        if (existingFollow) {
            throw new ErrorWithStatus({
                message: USERS_MESSAGES.ALREADY_FOLLOWED,
                status: HTTP_STATUS.CONFLICT,
            });
        }

        await databaseService.followers.insertOne(
            new Follower({
                user_id: new ObjectId(user_id),
                followed_user_id: new ObjectId(followed_user_id),
            }),
        );
    }

    async unfollow(user_id: string, followed_user_id: string) {
        const existingFollow = await databaseService.followers.findOne({
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id),
        });

        if (!existingFollow) {
            throw new ErrorWithStatus({
                message: USERS_MESSAGES.NOT_FOLLOWED,
                status: HTTP_STATUS.CONFLICT,
            });
        }

        await databaseService.followers.deleteOne({
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id),
        });
    }

    async changePassword(user_id: string, new_password: string) {
        await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            {
                $set: { password: hashPassword(new_password) },
                $currentDate: { updated_at: true },
            },
        );
    }
}

const usersService = new UserService();
export default usersService;
