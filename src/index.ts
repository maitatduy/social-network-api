import "dotenv/config";
import dns from "node:dns";
import express from "express";
import cors from "cors";
import path from "path";
import databaseService from "~/services/database.service";
import usersRouter from "~/routes/users.route";
import { defaultErrorHandler } from "~/middlewares/error.middleware";
import { initFolder } from "./utils/file";
import mediasRouter from "./routes/medias.route";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 3000;

initFolder();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/users", usersRouter);
app.use("/api/medias", mediasRouter);
app.use(defaultErrorHandler);

databaseService
    .connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server đang chạy ở cổng ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Kết nối database thất bại!", error);
        process.exit(1);
    });
