import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { USERS_MESSAGES } from "~/constants/messages";
import { RegisterReqBody } from "~/models/requests/User.request";
import { RegisterResponse } from "~/models/responses/User.response";
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
