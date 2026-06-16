import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from "~/constants/dir";
import { ErrorWithStatus } from "~/models/errors/Error";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ParamsDictionary } from "express-serve-static-core";
import { MEDIAS_MESSAGES } from "~/constants/messages";

interface ServeFileParams extends ParamsDictionary {
    name: string;
}

export const serveImageController = (req: Request<ServeFileParams>, res: Response) => {
    const { name } = req.params;
    const filePath = path.resolve(UPLOAD_IMAGE_DIR, name);

    if (!fs.existsSync(filePath)) {
        throw new ErrorWithStatus({
            message: MEDIAS_MESSAGES.FILE_NOT_FOUND,
            status: HTTP_STATUS.NOT_FOUND,
        });
    }

    res.sendFile(filePath);
};

export const serveVideoController = (req: Request<ServeFileParams>, res: Response) => {
    const { name } = req.params;
    const filePath = path.resolve(UPLOAD_VIDEO_DIR, name);

    if (!fs.existsSync(filePath)) {
        throw new ErrorWithStatus({
            message: MEDIAS_MESSAGES.FILENAME_NOT_STRING,
            status: HTTP_STATUS.NOT_FOUND,
        });
    }

    res.sendFile(filePath);
};
