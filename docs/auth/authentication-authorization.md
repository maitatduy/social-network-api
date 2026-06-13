# Authentication & Authorization

## Tổng quan

Dự án sử dụng JWT để xác thực và quản lý phiên đăng nhập. Có 4 loại token chính:

- `AccessToken`: dùng để xác thực các route yêu cầu đăng nhập.
- `RefreshToken`: dùng để đổi access token mới khi access token hết hạn.
- `EmailVerifyToken`: dùng để xác thực email người dùng.
- `ForgotPasswordToken`: dùng để xác thực yêu cầu reset mật khẩu.

Đồng thời, hệ thống dùng trạng thái `verify` của user để quyết định quyền truy cập dịch vụ.

---

## Mô hình token

### Payload chung

Payload JWT chứa:

- `user_id`: ID người dùng MongoDB.
- `token_type`: loại token, thuộc enum `TokenType`.

### Loại token

- `TokenType.AccessToken` = `0`
- `TokenType.RefreshToken` = `1`
- `TokenType.EmailRefreshToken` = `2`
- `TokenType.EmailVerifyToken` = `3`
- `TokenType.ForgotPasswordToken` = `4`

### Ký token

Token được ký bằng `process.env.JWT_SECRET` và thuật toán `HS256`.

Các thời gian hết hạn được lấy từ biến môi trường:

- `JWT_ACCESS_TOKEN_EXPIRES_IN`
- `JWT_REFRESH_TOKEN_EXPIRES_IN`
- `JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN`
- `JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN`

---

## Luồng xác thực

### Đăng nhập / đăng ký

- `POST /api/users/register`: tạo user mới, sinh `access_token` và `refresh_token`.
- `POST /api/users/login`: xác thực email + password, trả về `access_token` và `refresh_token`.

Khi đăng ký, password được hash và token xác thực email được lưu trong trường `email_verify_token`.

### Xác thực route

Các route yêu cầu access token dùng middleware `accessTokenValidator`.

#### Cách kiểm tra token

1. Lấy header `Authorization`.
2. Tách phần `Bearer <token>`.
3. Dùng `verifyToken()` với `JWT_SECRET`.
4. Kiểm tra `token_type` phải là `AccessToken`.
5. Lưu payload đã giải mã vào `req.decoded_authorization`.

### Kiểm tra user verified

Một số route phải kiểm tra user đã xác thực email:

- `verifiedUserValidator` kiểm tra `verify === UserVerifyStatus.Verified`.
- Nếu user chưa verify, trả về `403 Forbidden` với message `Tài khoản chưa được xác thực`.

Các route bắt buộc user verified:

- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/users/follow`
- `DELETE /api/users/follow/:user_id`
- `PUT /api/users/change-password`
- `POST /api/users/resend-verify-email`

---

## Các endpoint auth quan trọng

### POST /api/users/logout

- Xác thực access token.
- Dùng body `refresh_token` và xóa token khỏi collection `refresh_tokens`.
- Không cần verify user status.

### POST /api/users/refresh-token

- Dùng `refresh_token` trong body.
- Kiểm tra token hợp lệ và tồn tại trong DB.
- Kiểm tra `token_type` là `RefreshToken`.
- Nếu hợp lệ, xóa token cũ, sinh token mới và lưu token mới.

### POST /api/users/verify-email

- Dùng `email_verify_token` trong body.
- Kiểm tra `token_type` là `EmailVerifyToken`.
- Tìm user theo `user_id` trong payload.
- Kiểm tra token khớp token lưu trong trường `email_verify_token`.
- Nếu thành công, cập nhật `verify = Verified`, xóa `email_verify_token`, xóa tất cả refresh token cũ, rồi tạo lại access + refresh token mới.

### POST /api/users/resend-verify-email

- Yêu cầu access token.
- Chỉ thực hiện khi user tồn tại và chưa verify.
- Sinh lại `email_verify_token` mới và lưu vào DB.
- Hiện tại chưa gửi email thực tế, token chỉ được in ra console.

### POST /api/users/forgot-password

- Yêu cầu email.
- Nếu user tồn tại, sinh `forgot_password_token` và lưu vào DB.
- Hiện tại token được in ra console.

### POST /api/users/verify-forgot-password

- Xác thực `forgot_password_token` hợp lệ.
- Token phải có `token_type = ForgotPasswordToken`.
- Token phải khớp với giá trị trong user.

### POST /api/users/reset-password

- Yêu cầu `forgot_password_token`, `password`, `confirm_password`.
- Kiểm tra token hợp lệ và user tồn tại.
- Hash password mới và cập nhật user.

---

## Cấu trúc quyền hạn

### Authentication

- Mọi route write (POST/PUT/PATCH/DELETE) với user-specific action đều yêu cầu `Authorization: Bearer <access_token>`.
- Token hợp lệ phải giải mã được bằng `JWT_SECRET`.

### Authorization

- Hệ thống không phân biệt role admin/user.
- Quyền truy cập phụ thuộc vào 2 yếu tố:
    - token hợp lệ
    - user thuộc trạng thái `Verified` khi cần.

### Đặc biệt

- Các endpoint bên GET public như `/api/users/:username`, `/api/users/oauth/google/url`, `/api/users/oauth/google` không cần access token.
- `/api/users/login` và `/api/users/register` không yêu cầu authentication.

---

## Cơ chế lỗi và response

### Response error

Đa số lỗi trả về cấu trúc:

```json
{
    "message": "..."
}
```

Nếu validation body/headers thất bại, middleware trả về:

```json
{
    "message": "Dữ liệu gửi lên không hợp lệ!",
    "errors": {
        "field": {
            "msg": "..."
        }
    }
}
```

### Mã lỗi thường gặp

- `401 Unauthorized`: access token hoặc refresh token không hợp lệ.
- `403 Forbidden`: user chưa verified hoặc Gmail chưa verified.
- `404 Not Found`: user không tồn tại, refresh token không tồn tại.
- `409 Conflict`: trùng email, trùng username, đã follow, chưa follow.
- `422 Unprocessable Entity`: dữ liệu request không hợp lệ.
- `500 Internal Server Error`: lỗi hệ thống.
