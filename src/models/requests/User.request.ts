import { JwtPayload } from "jsonwebtoken";
import { TokenType } from "~/constants/enum";

export interface RegisterReqBody {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    date_of_birth: string;
}

export interface LoginReqBody {
    email: string;
    password: string;
}

export interface LogoutReqBody {
    refresh_token: string;
}

export interface RefreshTokenReqBody {
    refresh_token: string;
}

export interface TokenPayload extends JwtPayload {
    user_id: string;
    token_type: TokenType;
}

export interface VerifyEmailReqBody {
    email_verify_token: string;
}

export interface ForgotPasswordReqBody {
    email: string;
}

export interface ResetPasswordReqBody {
    forgot_password_token: string;
    password: string;
    confirm_password: string;
}

export interface UpdateMeReqBody {
    name?: string;
    date_of_birth?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    website?: string;
    username?: string;
    cover_photo?: string;
}

export interface GetUserProfileReqParams {
    username: string;
}

export interface FollowReqBody {
    followed_user_id: string;
}

export interface UnfollowReqParams {
    user_id: string;
}

export interface ChangePasswordReqBody {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
}
