import { ObjectId } from "mongodb";

export interface FollowerType {
    _id?: ObjectId;
    user_id: ObjectId; // người follow
    followed_user_id: ObjectId; // người được follow
    created_at?: Date;
}
