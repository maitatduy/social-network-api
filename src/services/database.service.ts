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
        } catch (error) {
            console.log(error);
            throw error;
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
