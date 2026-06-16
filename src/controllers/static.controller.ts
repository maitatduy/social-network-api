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
            message: MEDIAS_MESSAGES.FILE_NOT_FOUND,
            status: HTTP_STATUS.NOT_FOUND,
        });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        });
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
};
