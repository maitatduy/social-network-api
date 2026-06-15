import { Request, Response } from "express";
import { MEDIAS_MESSAGES } from "~/constants/messages";
import mediasService from "~/services/medias.service";

export const uploadImageController = async (req: Request, res: Response) => {
    const result = await mediasService.uploadImage(req);

    res.json({
        message: MEDIAS_MESSAGES.UPLOAD_SUCCESS,
        result,
    });
};
