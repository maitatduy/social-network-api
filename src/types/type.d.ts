import { WithId } from "mongodb";
import { UserType } from "~/models/schemas/User.schema";
import { TokenPayload } from "~/models/requests/User.request";

declare module "express" {
    interface Request {
        user?: WithId<UserType>;
        decoded_authorization?: TokenPayload;
        decoded_refresh_token?: TokenPayload;
        decoded_email_verify_token?: TokenPayload;
    }
}
