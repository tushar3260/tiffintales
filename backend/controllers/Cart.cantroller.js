import Cart from "../models/Cart.js";

// ✅ Add to cart (create or update item quantity)
export const addToCart = async (req, res) => {
  try {
    const { userId, item } = req.body;

    if (!userId || !item) {
      return res.status(400).json({ msg: "Invalid data" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [item] });
    } else {
      const index = cart.items.findIndex(i => i.mealId.equals(item.mealId));
      if (index > -1) {
        cart.items[index].quantity += item.quantity;
      } else {
        cart.items.push(item);
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ msg: "Error adding to cart", error: err.message });
  }
};

// ✅ Get all cart items by user ID
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching cart", error: err.message });
  }
};

// ✅ Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const { userId, mealId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const itemIndex = cart.items.findIndex(i => i.mealId.equals(mealId));
    if (itemIndex === -1) return res.status(404).json({ msg: "Item not found" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ msg: "Error updating item", error: err.message });
  }
};

// ✅ Delete specific item from cart
export const deleteCartItem = async (req, res) => {
  try {
    const { userId, mealId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter(i => !i.mealId.equals(mealId));
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ msg: "Error deleting item", error: err.message });
  }
};

// ✅ Clear all items from cart (reset)
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ msg: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ msg: "Error clearing cart", error: err.message });
  }
};
