import { checkSchema } from "express-validator";
import { validate } from "./validation.middleware";
import usersService from "~/services/users.service";

export const registerValidator = validate(
    checkSchema(
        {
            name: {
                notEmpty: {
                    errorMessage: "Tên là bắt buộc!",
                },
                isString: true,
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: "Tên phải có độ dài từ 1 đến 100 ký tự!",
                },
                trim: true,
            },
            email: {
                notEmpty: {
                    errorMessage: "Email là bắt buộc!",
                },
                isEmail: {
                    errorMessage: "Email không hợp lệ!",
                },
                normalizeEmail: true,
                custom: {
                    options: async (value) => {
                        const emailExists = await usersService.checkEmailExists(value);
                        if (emailExists) {
                            throw new Error("Email đã tồn tại!");
                        }
                        return true;
                    },
                },
            },
            password: {
                notEmpty: {
                    errorMessage: "Mật khẩu là bắt buộc!",
                },
                isLength: {
                    options: {
                        min: 6,
                        max: 50,
                    },
                    errorMessage: "Mật khẩu phải có độ dài từ 6 đến 50 ký tự!",
                },
            },
            confirm_password: {
                notEmpty: { errorMessage: "Xác nhận mật khẩu là bắt buộc!" },
                custom: {
                    options: (value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error("Mật khẩu xác nhận không khớp");
                        }
                        return true;
                    },
                },
            },
            date_of_birth: {
                isISO8601: {
                    options: {
                        strict: true,
                        strictSeparator: true,
                    },
                    errorMessage: "Định dạng ngày tháng không hợp lệ",
                },
            },
        },
        ["body"],
    ),
);
