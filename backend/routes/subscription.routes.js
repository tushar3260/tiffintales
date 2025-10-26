import express from 'express';
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription
} from '../controllers/subscription.controller.js';

const router = express.Router();

router.post("/", createSubscription);

// Get all subscriptions
router.get("/", getAllSubscriptions);

// Get subscription by ID
router.get("/:id", getSubscriptionById);

// Update subscription by ID
router.put("/:id", updateSubscription);

// Delete subscription by ID
router.delete("/:id", deleteSubscription);

export default router;
