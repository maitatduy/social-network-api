import { ObjectId } from "mongodb";

export interface RefreshTokenType {
    _id?: ObjectId;
    token: string;
    user_id: ObjectId;
    created_at?: Date;
    iat: number;
    exp: number;
}
