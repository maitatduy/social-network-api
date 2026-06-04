import User from "~/models/database/User";
import { RegisterReqBody } from "~/models/requests/User.request";
import databaseService from "./database.service";

class UserService {
    async register(payload: RegisterReqBody) {
        const user = new User({
            ...payload,
            date_of_birth: new Date(payload.date_of_birth),
        });
        await databaseService.users.insertOne(user);
        return { user_id: user._id };
    }

    async checkEmailExists(email: string) {
        const user = await databaseService.users.findOne({
            email,
        });
        return Boolean(user);
    }
}

const usersService = new UserService();
export default usersService;
