import path from "path";
import sharp from "sharp";
import { UPLOAD_IMAGE_DIR } from "~/constants/dir";
import { handleUploadImage, handleUploadVideo } from "~/utils/file";
import { Request } from "express";
import fs from "fs";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { MEDIAS_MESSAGES } from "~/constants/messages";
import { ErrorWithStatus } from "~/models/errors/Error";
import { envConfig } from "~/constants/config";

class MediasService {
    async uploadImage(req: Request) {
        const files = await handleUploadImage(req);
        const images = Array.isArray(files.image) ? files.image : files.image ? [files.image] : [];

        if (!images.length) {
            throw new ErrorWithStatus({
                message: MEDIAS_MESSAGES.NO_FILE_UPLOADED,
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }

        const result = await Promise.all(
            images.map(async (file) => {
                const newName = file.newFilename.split(".")[0];
                const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`);

                await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newPath);

                fs.unlinkSync(file.filepath);

                return {
                    url: `${envConfig.SERVER_URL}/static/images/${newName}.jpg`, // ← dùng SERVER_URL
                    name: `${newName}.jpg`,
                };
            }),
        );

        return result;
    }

    async uploadVideo(req: Request) {
        const files = await handleUploadVideo(req);
        const video = files.video![0];

        return {
            url: `${envConfig.SERVER_URL}/static/videos/${video.newFilename}`,
            name: video.newFilename,
        };
    }
}

const mediasService = new MediasService();
export default mediasService;
