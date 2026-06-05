import User from "~/models/database/User";
import { RegisterReqBody } from "~/models/requests/User.request";
import databaseService from "./database.service";
import { signToken } from "~/utils/jwt";
import { TokenType } from "~/constants/enum";
import { StringValue } from "ms";
import { hashPassword } from "~/utils/crypto";

class UserService {
    async register(payload: RegisterReqBody) {
        const user = new User({
            ...payload,
            date_of_birth: new Date(payload.date_of_birth),
            password: hashPassword(payload.password),
        });
        await databaseService.users.insertOne(user);

        const user_id = user._id!.toString();

        // Ký cả 2 token song song
        const [access_token, refresh_token] = await Promise.all([
            this.signAccessToken(user_id),
            this.signRefreshToken(user_id),
        ]);

        return { access_token, refresh_token };
    }

    async login(user_id: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.signAccessToken(user_id),
            this.signRefreshToken(user_id),
        ]);
        return { access_token, refresh_token };
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
}

const usersService = new UserService();
export default usersService;
