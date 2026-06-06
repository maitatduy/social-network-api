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

            await this.createIndexes();
        } catch (error) {
            console.log(error);
            throw error;
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
