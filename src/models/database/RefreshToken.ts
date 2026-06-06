import { ObjectId } from "mongodb";
import { RefreshTokenType } from "../schemas/RefreshToken.schema";

export default class RefreshToken {
    _id: ObjectId;
    token: string;
    user_id: ObjectId;
    created_at?: Date;
    iat: number;
    exp: number;

    constructor(refreshToken: RefreshTokenType) {
        this._id = refreshToken._id || new ObjectId();
        this.token = refreshToken.token;
        this.user_id = refreshToken.user_id;
        this.created_at = refreshToken.created_at || new Date();
        this.iat = refreshToken.iat;
        this.exp = refreshToken.exp;
    }
}
