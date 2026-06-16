import { Router } from "express";
import { uploadImageController, uploadVideoController } from "~/controllers/medias.controller";
import { accessTokenValidator } from "~/middlewares/users.middleware";
import { verifiedUserValidator } from "~/middlewares/users.middleware";
import { wrapAsync } from "~/utils/helpers";

const mediasRouter = Router();

mediasRouter.post(
    "/upload-image",
    accessTokenValidator,
    verifiedUserValidator,
    wrapAsync(uploadImageController),
);

mediasRouter.post(
    "/upload-video",
    accessTokenValidator,
    verifiedUserValidator,
    wrapAsync(uploadVideoController),
);

export default mediasRouter;
