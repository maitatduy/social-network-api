import { Router } from "express";
import {
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    verifyEmailController,
} from "~/controllers/users.controller";
import {
    accessTokenValidator,
    loginValidator,
    refreshTokenValidator,
    registerValidator,
    verifyEmailValidator,
} from "~/middlewares/users.middleware";
import { wrapAsync } from "~/utils/helpers";

const usersRouter = Router();

/**
 * Description: Register a new user
 * Path: /users/register
 * Method: POST
 * Request Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: string }
 */
usersRouter.post("/register", registerValidator, wrapAsync(registerController));

/**
 * Description: Authenticate user and return access token
 * Path: /users/login
 * Method: POST
 * Request Body: { email: string, password: string }
 */
usersRouter.post("/login", loginValidator, wrapAsync(loginController));

/**
 * Description: Logout user and invalidate refresh token
 * Path: /users/logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Request Body: { refresh_token: string }
 */
usersRouter.post(
    "/logout",
    accessTokenValidator,
    refreshTokenValidator,
    wrapAsync(logoutController),
);

/**
 * Description: Generate a new access token using refresh token
 * Path: /users/refresh-token
 * Method: POST
 * Request Body: { refresh_token: string }
 */
usersRouter.post("/refresh-token", refreshTokenValidator, wrapAsync(refreshTokenController));

/**
 * Description: Verify email when user client click on the link in email
 * Path: /users/verify-email
 * Method: POST
 * Request Body: { email_verify_token: string }
 */
usersRouter.post("/verify-email", verifyEmailValidator, wrapAsync(verifyEmailController));

export default usersRouter;
