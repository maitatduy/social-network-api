import { MongoClient, Db, Collection } from "mongodb";
import { RefreshTokenType } from "~/models/schemas/RefreshToken.schema";
import { UserType } from "~/models/schemas/User.schema";

const uri = process.env.MONGODB_URI as string;

class DatabaseService {
    private client: MongoClient;
    private db: Db;

    constructor() {
        this.client = new MongoClient(uri);
        this.db = this.client.db("linkup");
    }

    async connect() {
        try {
            await this.client.connect();

            await this.db.command({
                ping: 1,
            });

            console.log("Kết nối MongoDB thành công!");

            await Promise.all([this.createCollections(), this.createIndexes()]);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async createCollections() {
        const collections = await this.db.listCollections().toArray();
        const collectionNames = collections.map((c) => c.name);

        if (!collectionNames.includes("users")) {
            await this.db.createCollection("users", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["name", "email", "password", "created_at", "updated_at"],
                        properties: {
                            name: {
                                bsonType: "string",
                                minLength: 1,
                                maxLength: 100,
                                description: "Tên người dùng",
                            },
                            email: {
                                bsonType: "string",
                                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                                description: "Email người dùng",
                            },
                            password: {
                                bsonType: "string",
                                minLength: 1,
                                description: "Mật khẩu đã hash",
                            },
                            date_of_birth: {
                                bsonType: "date",
                                description: "Ngày sinh",
                            },
                            bio: {
                                bsonType: "string",
                                maxLength: 200,
                                description: "Giới thiệu bản thân",
                            },
                            avatar: {
                                bsonType: "string",
                                description: "URL ảnh đại diện",
                            },
                            verify: {
                                bsonType: "int",
                                enum: [0, 1, 2],
                                description: "0: Unverified, 1: Verified, 2: Banned",
                            },
                            email_verify_token: {
                                bsonType: "string",
                                description: "Token xác thực email",
                            },
                            forgot_password_token: {
                                bsonType: "string",
                                description: "Token đặt lại mật khẩu",
                            },
                            created_at: {
                                bsonType: "date",
                                description: "Thời điểm tạo",
                            },
                            updated_at: {
                                bsonType: "date",
                                description: "Thời điểm cập nhật",
                            },
                        },
                    },
                },
                validationLevel: "strict", // áp dụng cho cả insert lẫn update
                validationAction: "error", // từ chối document không hợp lệ
            });
        }

        if (!collectionNames.includes("refresh_tokens")) {
            await this.db.createCollection("refresh_tokens", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["token", "user_id", "iat", "exp", "created_at"],
                        properties: {
                            token: {
                                bsonType: "string",
                                description: "Refresh token string",
                            },
                            user_id: {
                                bsonType: "objectId",
                                description: "ID người dùng",
                            },
                            iat: {
                                bsonType: "int",
                                description: "Thời điểm tạo token",
                            },
                            exp: {
                                bsonType: "int",
                                description: "Thời điểm hết hạn token",
                            },
                            created_at: {
                                bsonType: "date",
                                description: "Thời điểm tạo",
                            },
                        },
                    },
                },
                validationLevel: "strict",
                validationAction: "error",
            });
        }
    }

    private async createIndexes() {
        await Promise.all([this.indexUsers(), this.indexRefreshTokens()]);
    }

    // Index cho collection users
    private async indexUsers() {
        const exists = await this.users.indexExists("email_1");
        if (!exists) {
            await this.users.createIndex({ email: 1 }, { unique: true });
            console.log("Tạo index users thành công");
        }
    }

    // TTL index cho collection refresh_tokens
    private async indexRefreshTokens() {
        const exists = await this.refreshTokens.indexExists("exp_1");
        if (!exists) {
            await this.refreshTokens.createIndex(
                { exp: 1 },
                { expireAfterSeconds: 0 }, // MongoDB tự xóa khi exp < thời điểm hiện tại
            );
            console.log("Tạo index refresh_tokens thành công");
        }
    }

    get users(): Collection<UserType> {
        return this.db.collection("users");
    }

    get refreshTokens(): Collection<RefreshTokenType> {
        return this.db.collection("refresh_tokens");
    }
}

const databaseService = new DatabaseService();

export default databaseService;
