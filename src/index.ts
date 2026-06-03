import "dotenv/config";
import dns from "node:dns";
import express from "express";
import databaseService from "~/services/database.service";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

databaseService.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server đang chạy ở cổng ${PORT}`);
        });
    }).catch((error) => {
        console.error("Kết nối database thất bại!", error);
        process.exit(1);
    });
