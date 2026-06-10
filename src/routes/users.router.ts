import { Router } from "express";
import {
    forgotPasswordController,
    getMeController,
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    resendVerifyEmailController,
    resetPasswordController,
    updateMeController,
    verifyEmailController,
    verifyForgotPasswordTokenController,
} from "~/controllers/users.controller";
import {
    accessTokenValidator,
    forgotPasswordValidator,
    loginValidator,
    refreshTokenValidator,
    registerValidator,
    resendVerifyEmailValidator,
    resetPasswordValidator,
    updateMeValidator,
    verifiedUserValidator,
    verifyEmailValidator,
    verifyForgotPasswordTokenValidator,
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

/**
 * Description: Resend email verification link to unverified user
 * Path: /users/resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.post(
    "/resend-verify-email",
    accessTokenValidator,
    resendVerifyEmailValidator,
    wrapAsync(resendVerifyEmailController),
);

/**
 * Description: Submit email to reset password, send email to user
 * Path: /users/forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post("/forgot-password", forgotPasswordValidator, wrapAsync(forgotPasswordController));

/**
 * Description. Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: {forgot_password_token: string}
 */
usersRouter.post(
    "/verify-forgot-password",
    verifyForgotPasswordTokenValidator,
    wrapAsync(verifyForgotPasswordTokenController),
);

/**
 * Description. Reset password using forgot password token
 * Path: /users/reset-password
 * Method: POST
 * Body: {
 *   forgot_password_token: string,
 *   password: string,
 *   confirm_password: string
 * }
 */
usersRouter.post(
    "/reset-password",
    verifyForgotPasswordTokenValidator,
    resetPasswordValidator,
    wrapAsync(resetPasswordController),
);

/**
 * Description. Get current user's profile
 * Path: /users/me
 * Method: GET
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.get("/me", accessTokenValidator, verifiedUserValidator, wrapAsync(getMeController));

/**
 * Description. Update current user's profile
 * Path: /users/me
 * Method: PATCH
 * Headers: { Authorization: Bearer <access_token> }
 * Body: {
 *   name?: string,
 *   date_of_birth?: string,
 *   bio?: string,
 *   avatar?: string
 * }
 */
usersRouter.patch(
    "/me",
    accessTokenValidator,
    verifiedUserValidator,
    updateMeValidator,
    wrapAsync(updateMeController),
);

export default usersRouter;
