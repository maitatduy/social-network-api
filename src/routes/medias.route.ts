import { Router } from "express";
import { uploadImageController } from "~/controllers/medias.controller";
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

export default mediasRouter;
