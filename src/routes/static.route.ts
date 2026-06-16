import { Router } from "express";
import { serveImageController, serveVideoController } from "~/controllers/static.controller";
import { wrapAsync } from "~/utils/helpers";

const staticRouter = Router();

staticRouter.get("/images/:name", wrapAsync(serveImageController));
staticRouter.get("/videos/:name", wrapAsync(serveVideoController));

export default staticRouter;
