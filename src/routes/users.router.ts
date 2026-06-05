import { Router } from "express";
import { loginController, registerController } from "~/controllers/users.controller";
import { loginValidator, registerValidator } from "~/middlewares/users.middleware";
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

export default usersRouter;
