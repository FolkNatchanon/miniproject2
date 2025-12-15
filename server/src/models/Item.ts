import { Schema, model } from "mongoose";

const ItemSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        name: { type: String, required: true, trim: true },
        qty: { type: Number, required: true, min: 0 },
        unit: { type: String, required: true, trim: true },
        cost: { type: Number, required: true, min: 0 },
        lowAt: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

export const ItemModel = model("Item", ItemSchema);