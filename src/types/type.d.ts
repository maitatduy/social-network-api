import { WithId } from "mongodb";
import { UserType } from "~/models/schemas/User.schema";
import { JwtPayload } from "jsonwebtoken";

declare module "express" {
    interface Request {
        user?: WithId<UserType>;
        decoded_authorization?: JwtPayload;
        decoded_refresh_token?: JwtPayload;
    }
}
