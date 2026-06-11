import { ObjectId } from "mongodb";
import { FollowerType } from "~/models/schemas/Follower.schema";

export default class Follower {
    _id: ObjectId;
    user_id: ObjectId;
    followed_user_id: ObjectId;
    created_at: Date;

    constructor(follower: FollowerType) {
        this._id = follower._id || new ObjectId();
        this.user_id = follower.user_id;
        this.followed_user_id = follower.followed_user_id;
        this.created_at = follower.created_at || new Date();
    }
}
