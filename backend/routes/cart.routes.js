// cart.routes.js
import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/Cart.cantroller.js";

const router = express.Router();

// ✅ Static routes MUST come before dynamic /:userId to prevent route conflicts
// Add item to cart
router.post("/add", addToCart);

// Update item quantity
router.put("/update", updateCartItem);

// Delete a specific item from the cart
router.delete("/delete", deleteCartItem);

// Clear all cart items for a user - needs userId as param
router.delete("/clear/:userId", clearCart);

// ✅ Dynamic route last — get cart by userId
router.get("/:userId", getCart);

export default router;
