import { Request, Response, NextFunction, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export const wrapAsync = <P = ParamsDictionary, ResBody = any, ReqBody = any, Query = ParsedQs>(
    fn: RequestHandler<P, ResBody, ReqBody, Query>,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req as Request<P, ResBody, ReqBody, Query>, res, next)).catch(next);
    };
};
