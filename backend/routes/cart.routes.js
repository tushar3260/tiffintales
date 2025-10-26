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

// ✅ Add or update item in cart
router.post("/add", addToCart);

// ✅ Get all cart items for a user
router.get("/:userId", getCart);

// ✅ Update quantity of a specific item in the cart
router.put("/update", updateCartItem);

// ✅ Delete a specific item from the cart
router.delete("/delete", deleteCartItem);

// ✅ Clear all items from the cart
router.delete("/clear", clearCart);

export default router;
