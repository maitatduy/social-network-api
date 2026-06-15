export const envConfig = {
    NODE_ENV: process.env.NODE_ENV || "development",
    SERVER_URL: process.env.SERVER_URL as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
    CLIENT_REDIRECT_URI: process.env.CLIENT_REDIRECT_URI as string,
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
} as const;
