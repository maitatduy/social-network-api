import { UserVerifyStatus } from "~/constants/enum";

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface MessageResponse {
    message: string;
}

export interface UserResponse {
    _id: string;
    name: string;
    email: string;
    date_of_birth: Date;
    bio: string;
    avatar: string;
    verify: UserVerifyStatus;
    created_at: Date;
    updated_at: Date;
}

export interface GetUserProfileResponse {
    _id: string;
    name: string;
    email: string;
    date_of_birth: Date;
    created_at?: Date;
    updated_at?: Date;
    verify?: UserVerifyStatus;
    bio?: string;
    location?: string;
    website?: string;
    username?: string;
    avatar?: string;
    cover_photo?: string;
}
