import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { USERS_MESSAGES } from "~/constants/messages";
import {
    ForgotPasswordReqBody,
    LoginReqBody,
    LogoutReqBody,
    RefreshTokenReqBody,
    RegisterReqBody,
    ResetPasswordReqBody,
    VerifyEmailReqBody,
} from "~/models/requests/User.request";
import { AuthResponse, MessageResponse } from "~/models/responses/User.response";
import usersService from "~/services/users.service";

export const registerController = async (
    req: Request<ParamsDictionary, AuthResponse, RegisterReqBody>,
    res: Response,
) => {
    const result = await usersService.register(req.body);
    res.status(201).json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        result,
    });
};

export const loginController = async (
    req: Request<ParamsDictionary, AuthResponse, LoginReqBody>,
    res: Response,
) => {
    const { _id } = req.user!;
    const result = await usersService.login(_id.toString());
    res.json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        result,
    });
};

export const logoutController = async (
    req: Request<ParamsDictionary, MessageResponse, LogoutReqBody>,
    res: Response,
) => {
    await usersService.logout(req.body.refresh_token);
    res.json({
        message: USERS_MESSAGES.LOGOUT_SUCCESS,
    });
};

export const refreshTokenController = async (
    req: Request<ParamsDictionary, AuthResponse, RefreshTokenReqBody>,
    res: Response,
) => {
    const { user_id } = req.decoded_refresh_token!;
    const { refresh_token } = req.body;

    const result = await usersService.refreshToken(user_id as string, refresh_token);

    res.json({
        message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
        result,
    });
};

export const verifyEmailController = async (
    req: Request<ParamsDictionary, AuthResponse, VerifyEmailReqBody>,
    res: Response,
) => {
    const { user_id } = req.decoded_email_verify_token!;
    const result = await usersService.verifyEmail(user_id as string);

    res.json({
        message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
        result,
    });
};

export const resendVerifyEmailController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization!;
    await usersService.resendVerifyEmail(user_id as string);

    res.json({
        message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
    });
};

export const forgotPasswordController = async (
    req: Request<ParamsDictionary, MessageResponse, ForgotPasswordReqBody>,
    res: Response,
) => {
    const { _id } = req.user!;
    await usersService.forgotPassword(_id.toString());

    res.json({
        message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESS,
    });
};

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
    res.json({ message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS });
};

export const resetPasswordController = async (
    req: Request<ParamsDictionary, MessageResponse, ResetPasswordReqBody>,
    res: Response,
) => {
    const { user_id } = req.decoded_forgot_password_token!;
    const { password } = req.body;

    await usersService.resetPassword(user_id as string, password);

    res.json({ message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS });
};

export const getMeController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization!;
    const result = await usersService.getMe(user_id);
    res.json({
        message: USERS_MESSAGES.GET_ME_SUCCESS,
        result,
    });
};
