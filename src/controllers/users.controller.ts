import { Request, Response } from "express";
import { RegisterReqBody } from "~/models/requests/User.request";
import usersService from "~/services/users.service";

export const registerController = async (req: Request, res: Response) => {
    const result = await usersService.register(req.body as RegisterReqBody);
    res.status(201).json({
        message: "Đăng ký thành công",
        result,
    });
};
