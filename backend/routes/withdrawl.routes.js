import express from "express";
import {
  requestWithdrawal,
  getAllWithdrawals,
  getWithdrawalsByChef,
  updateWithdrawalStatus,
} from "../controllers/withdrawl.controller.js";

const router = express.Router();

// POST: Chef requests withdrawal
router.post("/request", requestWithdrawal);

// GET: Admin gets all withdrawals
router.get("/all", getAllWithdrawals);

// GET: Chef-specific withdrawals
router.get("/chef/:chefId", getWithdrawalsByChef);

// PATCH: Admin updates status
router.patch("/status/:id", updateWithdrawalStatus);

export default router;
