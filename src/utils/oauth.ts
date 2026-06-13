import axios from "axios";

interface GoogleTokensResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    id_token: string;
}

interface GoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export const getGoogleOAuthTokens = async (code: string): Promise<GoogleTokensResult> => {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
    });
    return data;
};

export const getGoogleUserInfo = async (
    access_token: string,
    id_token: string,
): Promise<GoogleUserInfo> => {
    const { data } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        params: { access_token, alt: "json" },
        headers: { Authorization: `Bearer ${id_token}` },
    });
    return data;
};
