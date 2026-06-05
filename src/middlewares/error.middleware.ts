import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/errors/Error";

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ErrorWithStatus) {
        if (err.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
            return res.status(err.status).json({
                message: err.message,
                errors: err.errors,
            });
        }
        return res.status(err.status).json({
            message: err.message,
        });
    }

    // Lỗi không xác định
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: err.message || "Lỗi hệ thống",
    });
};
