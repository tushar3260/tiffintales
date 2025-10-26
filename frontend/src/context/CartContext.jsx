import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/userContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const baseURL = import.meta.env.VITE_API_URL;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart items from backend
  const fetchCart = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${baseURL}/cart/${user._id}`);
      let items = res.data?.items ?? [];
      if (!Array.isArray(items)) items = [];
      setCartItems(
        items.map(item => ({
          _id: item._id || item.mealId || Math.random().toString(36).substr(2, 9),
          mealId: item.mealId || item._id,
          title: item.title,
          price: item.price ?? 0,
          discountedPrice: item.discountedPrice,
          photo: item.photo || "",
          quantity: item.quantity || 1,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
      setError("Failed to load cart items.");
      toast.error("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  }, [user?._id, baseURL]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item(s) to cart
  // Accepts array [{ mealId, quantity }]
  const addItemsToCart = async (itemsToAdd) => {
    if (!user?._id) return;

    try {
      // Assuming backend supports bulk add - 
      // else you can loop over and await each POST
      for (const { mealId, quantity } of itemsToAdd) {
        await axios.post(`${baseURL}/cart/add`, {
          userId: user._id,
          item: { mealId, quantity },
        });
      }
      await fetchCart(); // Refresh cart from backend after adding
      toast.success("Items added to cart.");
    } catch (err) {
      console.error("Failed to add items to cart:", err);
      toast.error("Failed to add items to cart.");
    }
  };

  // Other useful methods like removeItem, clearCart, updateQuantity can go here,
  // updating the backend and then calling fetchCart() to sync state

  return (
    <CartContext.Provider
      value={{ cartItems, loading, error, fetchCart, addItemsToCart, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;