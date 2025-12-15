import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

const router = Router();

function setAuthCookie(res: any, token: string) {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

router.post("/register", async (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });
    if (String(password).length < 6) return res.status(400).json({ message: "Password too short" });

    const exists = await UserModel.findOne({ username });
    if (exists) return res.status(409).json({ message: "Username already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, passwordHash });

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.status(201).json({ id: user._id.toString(), username: user.username });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.json({ id: user._id.toString(), username: user.username });
});

router.post("/logout", async (_req, res) => {
    res.clearCookie("token", { path: "/" });
    res.status(204).send();
});

router.get("/me", async (req: any, res) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const user = await UserModel.findById(decoded.userId).select("_id username");
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        res.json({ id: user._id.toString(), username: user.username });
    } catch {
        res.status(401).json({ message: "Unauthorized" });
    }
});

export default router;