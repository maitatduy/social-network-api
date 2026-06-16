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

    USERNAME_IS_INVALID:
        "Username phải có từ 4 đến 15 ký tự, chỉ gồm chữ cái, số hoặc dấu gạch dưới và không được chỉ chứa số",
    USERNAME_MUST_BE_STRING: "Username phải là một chuỗi",
    USERNAME_EXISTED: "Username đã tồn tại",

    FOLLOW_SUCCESS: "Follow thành công",
    UNFOLLOW_SUCCESS: "Unfollow thành công",
    FOLLOWED_USER_ID_IS_REQUIRED: "followed_user_id là bắt buộc",
    FOLLOWED_USER_NOT_FOUND: "Người dùng muốn follow không tồn tại",
    ALREADY_FOLLOWED: "Bạn đã follow người dùng này rồi",
    NOT_FOLLOWED: "Bạn chưa follow người dùng này",
    CANNOT_FOLLOW_YOURSELF: "Không thể follow chính mình",
    CANNOT_FOLLOW_UNVERIFIED_USER: "Không thể follow người dùng chưa xác thực",

    CHANGE_PASSWORD_SUCCESS: "Đổi mật khẩu thành công",
    OLD_PASSWORD_IS_REQUIRED: "Mật khẩu cũ là bắt buộc",
    OLD_PASSWORD_IS_INCORRECT: "Mật khẩu cũ không đúng",
    NEW_PASSWORD_IS_REQUIRED: "Mật khẩu mới là bắt buộc",
    NEW_PASSWORD_MUST_BE_DIFFERENT: "Mật khẩu mới phải khác mật khẩu cũ",
    CONFIRM_NEW_PASSWORD_IS_REQUIRED: "Xác nhận mật khẩu mới là bắt buộc",
    CONFIRM_NEW_PASSWORD_NOT_MATCH: "Xác nhận mật khẩu mới không khớp",

    OAUTH_GOOGLE_SUCCESS: "Đăng nhập bằng Google thành công",
    GMAIL_NOT_VERIFIED: "Gmail chưa được xác thực",
} as const;

export const MEDIAS_MESSAGES = {
    UPLOAD_SUCCESS: "Upload ảnh thành công",
    FILE_NOT_FOUND: "File không tồn tại",
    FILE_TYPE_NOT_ALLOWED: "Chỉ chấp nhận file ảnh",
    FILE_SIZE_TOO_LARGE: "Dung lượng file tối đa 5MB",
    NO_FILE_UPLOADED: "Không có file nào được upload",
    MAX_FILES_EXCEEDED: "Tối đa 4 ảnh mỗi lần upload",
    TOTAL_FILE_SIZE_TOO_LARGE: "Tổng dung lượng tối đa 20MB",
    MISSING_PLUGIN: "Thiếu plugin xử lý file",
    PLUGIN_FUNCTION_ERROR: "Lỗi plugin xử lý file",
    UPLOAD_ABORTED: "Upload bị hủy",
    NO_PARSER: "Không tìm thấy parser phù hợp",
    UNINITIALIZED_PARSER: "Parser chưa được khởi tạo",
    FILENAME_NOT_STRING: "Tên file không hợp lệ",
    MAX_FIELDS_SIZE_EXCEEDED: "Tổng dung lượng các field vượt quá giới hạn",
    MAX_FIELDS_EXCEEDED: "Số lượng field vượt quá giới hạn",
    SMALLER_THAN_MIN_FILE_SIZE: "Dung lượng file quá nhỏ",
    BIGGER_THAN_TOTAL_MAX_FILE_SIZE: "Tổng dung lượng file vượt quá 20MB",
    NO_EMPTY_FILES: "Không chấp nhận file rỗng",
    MISSING_CONTENT_TYPE: "Thiếu Content-Type",
    MALFORMED_MULTIPART: "Dữ liệu multipart không hợp lệ",
    MISSING_MULTIPART_BOUNDARY: "Thiếu boundary trong multipart",
    UNKNOWN_TRANSFER_ENCODING: "Transfer encoding không được hỗ trợ",
    BIGGER_THAN_MAX_FILE_SIZE: "Dung lượng file vượt quá 5MB",
    PLUGIN_FAILED: "Plugin xử lý file thất bại",
    CANNOT_CREATE_DIR: "Không thể tạo thư mục upload",
    INVALID_FIELD_NAME: 'Field name phải là "image"',
    UPLOAD_VIDEO_SUCCESS: "Upload video thành công",
} as const;
