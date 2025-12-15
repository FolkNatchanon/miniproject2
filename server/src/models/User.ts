import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        passwordHash: { type: String, required: true }
    },
    { timestamps: true }
);

export const UserModel = model("User", UserSchema);