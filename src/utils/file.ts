import fs from "fs";
import { UPLOAD_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from "~/constants/dir";
import formidable, { Files } from "formidable";
import { Request } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { MEDIAS_MESSAGES } from "~/constants/messages";
import { ErrorWithStatus } from "~/models/errors/Error";

export const initFolder = () => {
    [UPLOAD_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Tạo thư mục ${dir}`);
        }
    });
};

export const handleUploadImage = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_TEMP_DIR,
        maxFiles: 4,
        maxFileSize: 5 * 1024 * 1024,
        maxTotalFileSize: 20 * 1024 * 1024,
        keepExtensions: true,
        filter: ({ name, originalFilename, mimetype }) => {
            const isValidFieldName = name === "image";

            const isImage = Boolean(mimetype?.startsWith("image/"));

            const hasFilename = Boolean(originalFilename);

            if (!isValidFieldName || !isImage || !hasFilename) {
                form.emit(
                    "error" as any,
                    new ErrorWithStatus({
                        message: !isValidFieldName
                            ? MEDIAS_MESSAGES.INVALID_FIELD_NAME
                            : !hasFilename
                              ? MEDIAS_MESSAGES.FILENAME_NOT_STRING
                              : MEDIAS_MESSAGES.FILE_TYPE_NOT_ALLOWED,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    }) as any,
                );
                return false;
            }

            return true;
        },
    });

    return new Promise<Files>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                if (err instanceof ErrorWithStatus) return reject(err);

                const formidableErrors: Record<number, string> = {
                    1000: MEDIAS_MESSAGES.MISSING_PLUGIN,
                    1001: MEDIAS_MESSAGES.PLUGIN_FUNCTION_ERROR,
                    1002: MEDIAS_MESSAGES.UPLOAD_ABORTED,
                    1003: MEDIAS_MESSAGES.NO_PARSER,
                    1004: MEDIAS_MESSAGES.UNINITIALIZED_PARSER,
                    1005: MEDIAS_MESSAGES.FILENAME_NOT_STRING,
                    1006: MEDIAS_MESSAGES.MAX_FIELDS_SIZE_EXCEEDED,
                    1007: MEDIAS_MESSAGES.MAX_FIELDS_EXCEEDED,
                    1008: MEDIAS_MESSAGES.SMALLER_THAN_MIN_FILE_SIZE,
                    1009: MEDIAS_MESSAGES.BIGGER_THAN_TOTAL_MAX_FILE_SIZE,
                    1010: MEDIAS_MESSAGES.NO_EMPTY_FILES,
                    1011: MEDIAS_MESSAGES.MISSING_CONTENT_TYPE,
                    1012: MEDIAS_MESSAGES.MALFORMED_MULTIPART,
                    1013: MEDIAS_MESSAGES.MISSING_MULTIPART_BOUNDARY,
                    1014: MEDIAS_MESSAGES.UNKNOWN_TRANSFER_ENCODING,
                    1015: MEDIAS_MESSAGES.MAX_FILES_EXCEEDED,
                    1016: MEDIAS_MESSAGES.BIGGER_THAN_MAX_FILE_SIZE,
                    1017: MEDIAS_MESSAGES.PLUGIN_FAILED,
                    1018: MEDIAS_MESSAGES.CANNOT_CREATE_DIR,
                };

                const message = formidableErrors[err.code] ?? err.message;

                return reject(
                    new ErrorWithStatus({
                        message,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    }),
                );
            }

            if (!files.image || !files.image.length) {
                return reject(
                    new ErrorWithStatus({
                        message: MEDIAS_MESSAGES.NO_FILE_UPLOADED,
                        status: HTTP_STATUS.BAD_REQUEST,
                    }),
                );
            }

            resolve(files);
        });
    });
};

export const handleUploadVideo = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_VIDEO_DIR,
        maxFiles: 1,
        maxFileSize: 200 * 1024 * 1024,
        keepExtensions: true,
        filter: ({ name, originalFilename, mimetype }) => {
            const isValidFieldName = name === "video";
            const isVideo = Boolean(mimetype?.startsWith("video/"));
            const hasFilename = Boolean(originalFilename);

            if (!isValidFieldName || !isVideo || !hasFilename) {
                form.emit(
                    "error" as any,
                    new ErrorWithStatus({
                        message: !isValidFieldName
                            ? MEDIAS_MESSAGES.INVALID_FIELD_NAME
                            : !hasFilename
                              ? MEDIAS_MESSAGES.FILENAME_NOT_STRING
                              : MEDIAS_MESSAGES.FILE_TYPE_NOT_ALLOWED,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    }) as any,
                );
                return false;
            }

            return true;
        },
    });

    return new Promise<Files>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                if (err instanceof ErrorWithStatus) return reject(err);

                const formidableErrors: Record<number, string> = {
                    1009: MEDIAS_MESSAGES.BIGGER_THAN_TOTAL_MAX_FILE_SIZE,
                    1015: MEDIAS_MESSAGES.MAX_FILES_EXCEEDED,
                    1016: MEDIAS_MESSAGES.BIGGER_THAN_MAX_FILE_SIZE,
                };

                return reject(
                    new ErrorWithStatus({
                        message: formidableErrors[err.code] ?? err.message,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    }),
                );
            }

            if (!files.video || !files.video.length) {
                return reject(
                    new ErrorWithStatus({
                        message: MEDIAS_MESSAGES.NO_FILE_UPLOADED,
                        status: HTTP_STATUS.BAD_REQUEST,
                    }),
                );
            }

            resolve(files);
        });
    });
};
