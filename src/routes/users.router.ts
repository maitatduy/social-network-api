import { Router } from "express";
import { registerController } from "~/controllers/users.controller";
import { registerValidator } from "~/middlewares/users.middleware";

const usersRouter = Router();

/**
 * Description: Register a new user
 * Path: /users/register
 * Method: POST
 * Request Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: string }
 */
usersRouter.post("/register", registerValidator, registerController);

export default usersRouter;
