export const USERS_MESSAGES = {
    NAME_IS_REQUIRED: "Tên là bắt buộc",
    NAME_LENGTH: "Tên phải có độ dài từ 1 đến 100 ký tự",

    EMAIL_IS_REQUIRED: "Email là bắt buộc",
    EMAIL_IS_INVALID: "Email không hợp lệ",
    EMAIL_ALREADY_EXISTS: "Email đã tồn tại trên hệ thống",
    EMAIL_OR_PASSWORD_IS_INCORRECT: "Email hoặc mật khẩu không chính xác",

    PASSWORD_IS_REQUIRED: "Mật khẩu là bắt buộc",
    PASSWORD_LENGTH: "Mật khẩu phải có độ dài từ 6 đến 50 ký tự",
    PASSWORD_IS_WEAK: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",

    CONFIRM_PASSWORD_IS_REQUIRED: "Xác nhận mật khẩu là bắt buộc",
    CONFIRM_PASSWORD_NOT_MATCH: "Mật khẩu xác nhận không khớp",

    DATE_OF_BIRTH_IS_INVALID: "Định dạng ngày tháng không hợp lệ",

    REGISTER_SUCCESS: "Đăng ký thành công",

    LOGIN_SUCCESS: "Đăng nhập thành công",

    LOGOUT_SUCCESS: "Đăng xuất thành công",

    REFRESH_TOKEN_IS_REQUIRED: "Refresh token là bắt buộc",
    REFRESH_TOKEN_IS_INVALID: "Refresh token không hợp lệ",
    REFRESH_TOKEN_NOT_FOUND: "Refresh token không tồn tại",

    ACCESS_TOKEN_IS_REQUIRED: "Access token là bắt buộc",
    ACCESS_TOKEN_IS_INVALID: "Access token không hợp lệ",

    REFRESH_TOKEN_SUCCESS: "Làm mới token thành công",

    EMAIL_VERIFY_TOKEN_IS_REQUIRED: "Email verify token là bắt buộc",
    EMAIL_VERIFY_TOKEN_IS_INVALID: "Email verify token không hợp lệ",
    EMAIL_ALREADY_VERIFIED: "Email đã được xác thực",
    VERIFY_EMAIL_SUCCESS: "Xác thực email thành công",

    RESEND_VERIFY_EMAIL_SUCCESS: "Gửi lại email xác thực thành công",
    USER_NOT_FOUND: "Người dùng không tồn tại",
    USER_NOT_VERIFIED: "Tài khoản chưa được xác thực",

    FORGOT_PASSWORD_SUCCESS: "Gửi email reset mật khẩu thành công",
    FORGOT_PASSWORD_TOKEN_IS_REQUIRED: "Forgot password token là bắt buộc",
    FORGOT_PASSWORD_TOKEN_IS_INVALID: "Forgot password token không hợp lệ",
    RESET_PASSWORD_SUCCESS: "Đặt lại mật khẩu thành công",

    VERIFY_FORGOT_PASSWORD_SUCCESS: "Xác thực forgot password token thành công",

    GET_ME_SUCCESS: "Lấy thông tin người dùng thành công",

    UPDATE_ME_SUCCESS: "Cập nhật thông tin thành công",
    BIO_LENGTH: "Bio phải có độ dài từ 1 đến 200 ký tự",
    AVATAR_IS_INVALID: "Avatar không hợp lệ",

    GET_USER_PROFILE_SUCCESS: "Lấy thông tin người dùng thành công",
    USERNAME_IS_INVALID: "Username không hợp lệ",
} as const;
