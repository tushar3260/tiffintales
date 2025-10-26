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

router.post("/", placeOrder); // POST /api/orders
router.get("/", getAllOrders); // GET /api/orders
router.get("/user/:userId", getOrdersByUser); // GET /api/orders/user/:userId
router.get("/:id", getOrderById); // GET /api/orders/:id
router.put("/:id", updateOrderStatus);
router.get("/chef/:chefId", getOrderbyChefId);
 // PUT /api/orders/:id

export default router;
