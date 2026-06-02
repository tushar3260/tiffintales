// CartContext.jsx — Performance-optimized with useMemo + optimistic updates
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/userContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useUser();
  const baseURL = import.meta.env.VITE_API_URL;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // ✅ Memoize auth config so it doesn't recreate on every render
  const authConfig = useMemo(
    () => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    [token]
  );

  // ✅ Fetch cart (called on mount and after mutations)
  const fetchCart = useCallback(async () => {
    if (!user?._id) { setCartItems([]); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${baseURL}/cart/${user._id}`, authConfig);
      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      setCartItems(
        items.map((item) => ({
          _id:            item._id || item.mealId,
          mealId:         item.mealId || item._id,
          title:          item.title,
          price:          item.price ?? 0,
          discountedPrice: item.discountedPrice,
          photo:          item.photo || "",
          quantity:       item.quantity || 1,
          chefId:         item.chefId,
          tags:           item.tags || [],
        }))
      );
    } catch {
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  }, [user?._id, baseURL, authConfig]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ✅ Add items to cart
  const addItemsToCart = async (itemsToAdd) => {
    if (!user?._id) { toast.error("Please login to add items to cart."); return; }
    try {
      for (const item of itemsToAdd) {
        await axios.post(`${baseURL}/cart/add`, { userId: user._id, item }, authConfig);
      }
      await fetchCart();
      toast.success("Item(s) added to cart. 🛒");
    } catch {
      toast.error("Failed to add items to cart.");
    }
  };

  // ✅ Update quantity — with optimistic update (instant UI response)
  const updateQuantity = async (mealId, quantity) => {
    if (!user?._id) return;
    if (quantity <= 0) { await removeItem(mealId); return; }

    // Optimistic: update local state immediately
    setCartItems((prev) =>
      prev.map((item) =>
        (item.mealId === mealId || item._id === mealId) ? { ...item, quantity } : item
      )
    );

    try {
      await axios.put(`${baseURL}/cart/update`, { userId: user._id, mealId, quantity }, authConfig);
    } catch {
      toast.error("Failed to update quantity.");
      fetchCart(); // revert on failure
    }
  };

  // ✅ Remove item — with optimistic update
  const removeItem = async (mealId) => {
    if (!user?._id) return;

    // Optimistic remove
    setCartItems((prev) =>
      prev.filter((item) => item.mealId !== mealId && item._id !== mealId)
    );

    try {
      await axios.delete(`${baseURL}/cart/delete`, {
        ...authConfig,
        data: { userId: user._id, mealId },
      });
      toast.success("Item removed.");
    } catch {
      toast.error("Failed to remove item.");
      fetchCart(); // revert on failure
    }
  };

  // ✅ Clear entire cart
  const clearAllItems = async () => {
    if (!user?._id) return;
    setCartItems([]); // Optimistic clear
    try {
      await axios.delete(`${baseURL}/cart/clear/${user._id}`, authConfig);
      toast.success("Cart cleared.");
    } catch {
      toast.error("Failed to clear cart.");
      fetchCart(); // revert on failure
    }
  };

  // ✅ Computed total — memoized
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(() => ({
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
  }), [cartItems, loading, error, cartTotal, fetchCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

export default CartProvider;