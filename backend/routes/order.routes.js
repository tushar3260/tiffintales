import express from "express";
import {
  placeOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  getOrderbyChefId
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", placeOrder);           // POST /api/orders
router.get("/", getAllOrders);           // GET /api/orders (admin)

// ✅ Static/specific routes BEFORE dynamic /:id to prevent shadowing
router.get("/user/:userId", getOrdersByUser);   // GET /api/orders/user/:userId
router.get("/chef/:chefId", getOrderbyChefId);  // GET /api/orders/chef/:chefId

// ✅ Dynamic route last
router.get("/:id", getOrderById);       // GET /api/orders/:id
router.put("/:id", updateOrderStatus);  // PUT /api/orders/:id

export default router;
