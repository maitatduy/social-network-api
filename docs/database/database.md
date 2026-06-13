# Database Documentation

## Tổng quan

Dự án sử dụng MongoDB để lưu trữ dữ liệu. Kết nối và quản lý database được thực hiện trong `src/services/database.service.ts`.

Base database name: `linkup`

---

## Kết nối MongoDB

- URI kết nối lấy từ `process.env.MONGODB_URI`.
- `DatabaseService.connect()` thực hiện:
    - `client.connect()`
    - `db.command({ ping: 1 })`
    - Tạo collection nếu chưa tồn tại.
    - Tạo index.

---

## Collections

### 1. `users`

#### Validator JSON Schema

- required: `name`, `email`, `password`, `created_at`, `updated_at`
- properties:
    - `name`: string, 1-100 ký tự.
    - `email`: string, regex email hợp lệ.
    - `password`: string.
    - `date_of_birth`: date.
    - `bio`: string, tối đa 200 ký tự.
    - `avatar`: string.
    - `verify`: int, enum [0,1,2].
    - `email_verify_token`: string.
    - `forgot_password_token`: string.
    - `created_at`: date.
    - `updated_at`: date.

#### Cấu trúc document

```json
{
  "_id": ObjectId,
  "name": "string",
  "email": "string",
  "password": "string",
  "date_of_birth": ISODate,
  "bio": "string",
  "location": "string",
  "website": "string",
  "username": "string",
  "avatar": "string",
  "cover_photo": "string",
  "verify": 0,
  "email_verify_token": "string",
  "forgot_password_token": "string",
  "created_at": ISODate,
  "updated_at": ISODate
}
```

#### Indexes

- Unique index trên `email`.

### 2. `refresh_tokens`

#### Validator JSON Schema

- required: `token`, `user_id`, `iat`, `exp`, `created_at`
- properties:
    - `token`: string.
    - `user_id`: objectId.
    - `iat`: int.
    - `exp`: int.
    - `created_at`: date.

#### Cấu trúc document

```json
{
  "_id": ObjectId,
  "token": "string",
  "user_id": ObjectId,
  "iat": 1670000000,
  "exp": 1670003600,
  "created_at": ISODate
}
```

#### Indexes

- TTL index trên `exp` với `expireAfterSeconds: 0`.
- Khi `exp` < thời điểm hiện tại, MongoDB tự động xóa document.

### 3. `followers`

#### Validator JSON Schema

- required: `user_id`, `followed_user_id`, `created_at`
- properties:
    - `user_id`: objectId.
    - `followed_user_id`: objectId.
    - `created_at`: date.

#### Cấu trúc document

```json
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "followed_user_id": ObjectId,
  "created_at": ISODate
}
```

---

## Services và kiểu dữ liệu

### `src/services/database.service.ts`

- `users`: collection `users`
- `refreshTokens`: collection `refresh_tokens`
- `followers`: collection `followers`

Các method chính:

- `connect()`: kết nối MongoDB, tạo collection và index.
- `createCollections()`: tạo schema validator nếu collection chưa tồn tại.
- `createIndexes()`: tạo index cho collections.

### Model TypeScript

#### `UserType`

Định nghĩa trong `src/models/schemas/User.schema.ts`:

- `_id?`: ObjectId
- `name`: string
- `email`: string
- `date_of_birth?`: Date
- `password`: string
- `created_at?`: Date
- `updated_at?`: Date
- `email_verify_token?`: string
- `forgot_password_token?`: string
- `verify?`: `UserVerifyStatus`
- `close_friends?`: ObjectId[]
- `bio?`: string
- `location?`: string
- `website?`: string
- `username?`: string
- `avatar?`: string
- `cover_photo?`: string

#### `RefreshTokenType`

Định nghĩa trong `src/models/schemas/RefreshToken.schema.ts`.

#### `FollowerType`

Định nghĩa trong `src/models/schemas/Follower.schema.ts`.

---

## Mối liên hệ dữ liệu

### User và Refresh Token

- Mỗi user có thể có nhiều `refresh_tokens`.
- Khi đăng nhập/đăng ký/refresh token/verify email, hệ thống tạo `RefreshToken` mới và lưu vào collection.
- Khi logout, xóa refresh token tương ứng.
- Khi verify email, xóa tất cả refresh token của user cũ.

### Follow

- `followers` lưu mỗi quan hệ follow một dòng.
- `user_id`: người follow.
- `followed_user_id`: người được follow.
- Khi follow, tạo record mới.
- Khi unfollow, xóa record tương ứng.

---

## Business logic database

### Lưu trữ token

- `refresh_tokens` sử dụng TTL index theo trường `exp`.
- Refresh token vẫn tồn tại trong DB cho đến khi bị xóa thủ công hoặc hết hạn.

### Khởi tạo dữ liệu

- Collection `users` có validator dữ liệu mạnh trên MongoDB.
- `email` chỉ được index duy nhất.

### Mở rộng

- Có thể thêm index cho `username` nếu cần tìm theo username nhanh hơn.
- Các trường như `bio`, `location`, `website` không bắt buộc.
