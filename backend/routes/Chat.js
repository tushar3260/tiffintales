import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// Get all messages for an order
router.get("/:orderId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ orderId: req.params.orderId }).sort("createdAt");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

export default router;
