export interface RegisterReqBody {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    date_of_birth: string;
}

export interface LoginReqBody {
    email: string;
    password: string;
}

export interface LogoutReqBody {
    refresh_token: string;
}
