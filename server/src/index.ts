import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth";
import itemsRouter from "./routes/items";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ต้องเปิด credentials เพราะเราใช้ cookie
app.use(
    cors({
        origin: CLIENT_ORIGIN,
        credentials: true,
    })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`✅ Server http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("❌ Mongo connect error:", err);
        process.exit(1);
    });