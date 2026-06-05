import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { USERS_MESSAGES } from "~/constants/messages";
import { LoginReqBody, RegisterReqBody } from "~/models/requests/User.request";
import { LoginResponse, RegisterResponse } from "~/models/responses/User.response";
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
