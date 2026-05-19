import express from 'express';
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  getSubscriptionsByUser
} from '../controllers/subscription.controller.js';

const router = express.Router();

router.post("/", createSubscription);

// Get all subscriptions (admin)
router.get("/", getAllSubscriptions);

// ✅ Get subscriptions for a specific user — static before dynamic
router.get("/user/:userId", getSubscriptionsByUser);

// Get subscription by ID
router.get("/:id", getSubscriptionById);

// Update subscription by ID
router.put("/:id", updateSubscription);

// Delete subscription by ID
router.delete("/:id", deleteSubscription);

export default router;
