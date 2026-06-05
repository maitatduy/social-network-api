import { ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ErrorWithStatus } from "~/models/errors/Error";
import { HTTP_STATUS } from "~/constants/httpStatus";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorsObject = errors.mapped();

        // Duyệt qua từng lỗi, nếu cái nào là ErrorWithStatus thì next(err) luôn
        for (const key in errorsObject) {
            const { msg } = errorsObject[key];

            if (msg instanceof ErrorWithStatus) {
                return next(msg);
            }
        }
        return next(
            new ErrorWithStatus({
                message: "Dữ liệu gửi lên không hợp lệ!",
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                errors: errorsObject,
            }),
        );
    };
};
