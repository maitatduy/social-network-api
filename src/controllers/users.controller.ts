import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { RegisterReqBody } from "~/models/requests/User.request";
import { RegisterResponse } from "~/models/responses/User.response";
import usersService from "~/services/users.service";

export const registerController = async (
    req: Request<ParamsDictionary, RegisterResponse, RegisterReqBody>,
    res: Response,
) => {
    const result = await usersService.register(req.body);
    res.status(201).json({
        message: "Đăng ký thành công",
        result,
    });
};
