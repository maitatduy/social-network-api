import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { USERS_MESSAGES } from "~/constants/messages";
import {
    LoginReqBody,
    LogoutReqBody,
    RefreshTokenReqBody,
    RegisterReqBody,
    VerifyEmailReqBody,
} from "~/models/requests/User.request";
import {
    LoginResponse,
    RegisterResponse,
    VerifyEmailResponse,
} from "~/models/responses/User.response";
import usersService from "~/services/users.service";

export const registerController = async (
    req: Request<ParamsDictionary, RegisterResponse, RegisterReqBody>,
    res: Response,
) => {
    const result = await usersService.register(req.body);
    res.status(201).json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        result,
    });
};

export const loginController = async (
    req: Request<ParamsDictionary, LoginResponse, LoginReqBody>,
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
    req: Request<ParamsDictionary, any, LogoutReqBody>,
    res: Response,
) => {
    await usersService.logout(req.body.refresh_token);
    res.json({
        message: USERS_MESSAGES.LOGOUT_SUCCESS,
    });
};

export const refreshTokenController = async (
    req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
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
    req: Request<ParamsDictionary, VerifyEmailResponse, VerifyEmailReqBody>,
    res: Response,
) => {
    const { user_id } = req.decoded_email_verify_token!;
    const result = await usersService.verifyEmail(user_id as string);

    res.json({
        message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
        result,
    });
};
