import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const signToken = ({
    payload,
    privateKey = process.env.JWT_SECRET as string,
    options,
}: {
    payload: object;
    privateKey?: string;
    options: SignOptions;
}) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, privateKey, options, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token as string);
            }
        });
    });
};

export const decodeToken = (token: string) => {
    return jwt.decode(token) as {
        iat: number;
        exp: number;
        [key: string]: any;
    };
};

export const verifyToken = ({
    token,
    secretOrPublicKey = process.env.JWT_SECRET as string,
}: {
    token: string;
    secretOrPublicKey?: string;
}) => {
    return new Promise<JwtPayload>((resolve, reject) => {
        jwt.verify(token, secretOrPublicKey, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded as JwtPayload);
        });
    });
};
