import { Request, Response, NextFunction } from "express";
import pick from "lodash/pick";

export const filterMiddleware = <T>(filterKeys: (keyof T)[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        req.body = pick(req.body, filterKeys);
        next();
    };
};
