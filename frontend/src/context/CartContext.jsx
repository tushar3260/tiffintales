import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/userContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useUser();
  const baseURL = import.meta.env.VITE_API_URL;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Build axios config with auth header
  const authConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  // ✅ Fetch cart items from backend
  const fetchCart = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${baseURL}/cart/${user._id}`, authConfig);
      let items = res.data?.items ?? [];
      if (!Array.isArray(items)) items = [];
      setCartItems(
        items.map((item) => ({
          _id: item._id || item.mealId,
          mealId: item.mealId || item._id,
          title: item.title,
          price: item.price ?? 0,
          discountedPrice: item.discountedPrice,
          photo: item.photo || "",
          quantity: item.quantity || 1,
        }))
      );
    } catch {
      setError("Failed to load cart items.");
      toast.error("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  }, [user?._id, baseURL]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ Add item(s) to cart — each item must have { mealId, title, price, photo, quantity }
  const addItemsToCart = async (itemsToAdd) => {
    if (!user?._id) {
      toast.error("Please login to add items to cart.");
      return;
    }
    try {
      for (const item of itemsToAdd) {
        await axios.post(
          `${baseURL}/cart/add`,
          { userId: user._id, item },
          authConfig
        );
      }
      await fetchCart();
      toast.success("Item(s) added to cart.");
    } catch {
      toast.error("Failed to add items to cart.");
    }
  };

  // ✅ Update quantity of a single cart item
  const updateQuantity = async (mealId, quantity) => {
    if (!user?._id) return;
    try {
      if (quantity <= 0) {
        await removeItem(mealId);
        return;
      }
      await axios.put(
        `${baseURL}/cart/update`,
        { userId: user._id, mealId, quantity },
        authConfig
      );
      await fetchCart();
    } catch {
      toast.error("Failed to update item quantity.");
    }
  };

  // ✅ Remove a single item from cart
  const removeItem = async (mealId) => {
    if (!user?._id) return;
    try {
      await axios.delete(`${baseURL}/cart/delete`, {
        ...authConfig,
        data: { userId: user._id, mealId },
      });
      await fetchCart();
      toast.success("Item removed from cart.");
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  // ✅ Clear entire cart
  const clearAllItems = async () => {
    if (!user?._id) return;
    try {
      await axios.delete(`${baseURL}/cart/clear/${user._id}`, authConfig);
      setCartItems([]);
      toast.success("Cart cleared.");
    } catch {
      toast.error("Failed to clear cart.");
    }
  };

  // Computed total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        cartTotal,
        fetchCart,
        addItemsToCart,
        updateQuantity,
        removeItem,
        clearAllItems,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;