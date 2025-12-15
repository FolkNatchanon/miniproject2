import { Router } from "express";
import { ItemModel } from "../models/Item";
import { requireAuth, type AuthedRequest } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthedRequest, res) => {
    const items = await ItemModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(
        items.map((it) => ({
            id: it._id.toString(),
            name: it.name,
            qty: it.qty,
            unit: it.unit,
            cost: it.cost,
            lowAt: it.lowAt,
        }))
    );
});

router.post("/", async (req: AuthedRequest, res) => {
    const { name, qty, unit, cost, lowAt } = req.body ?? {};
    const doc = await ItemModel.create({ userId: req.userId, name, qty, unit, cost, lowAt });
    res.status(201).json({
        id: doc._id.toString(),
        name: doc.name,
        qty: doc.qty,
        unit: doc.unit,
        cost: doc.cost,
        lowAt: doc.lowAt,
    });
});

router.patch("/:id", async (req: AuthedRequest, res) => {
    const updated = await ItemModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Item not found" });

    res.json({
        id: updated._id.toString(),
        name: updated.name,
        qty: updated.qty,
        unit: updated.unit,
        cost: updated.cost,
        lowAt: updated.lowAt,
    });
});

router.delete("/:id", async (req: AuthedRequest, res) => {
    const deleted = await ItemModel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.status(204).send();
});

export default router;