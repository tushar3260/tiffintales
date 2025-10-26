import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { FaMinus, FaPlus, FaShoppingCart, FaRedo, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/userContext";
import { storage } from "../utils/Storage";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const [cartItems, setCartItems] = useState([]);
  const [userOrders, setUserOrders] = useState([]); // past orders
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [errorCart, setErrorCart] = useState("");

  const baseURL = import.meta.env.VITE_API_URL;

  /* ------------------------ FETCH CART ITEMS ------------------------ */
  useEffect(() => {
    if (!user?._id) return;
    setLoadingCart(true);
    setErrorCart("");

    axios
      .get(`${baseURL}/cart/${user._id}`)
      .then((res) => {
        const items = res.data?.items || [];
        setCartItems(
          Array.isArray(items)
            ? items.map((item) => ({
                _id: item._id || item.mealId || Math.random().toString(36).substr(2, 9),
                mealId: item.mealId || item._id,
                title: item.title,
                price: item.price ?? 0,
                discountedPrice: item.discountedPrice,
                photo: item.photo || "",
                quantity: item.quantity || 1,
              }))
            : []
        );
      })
      .catch((err) => {
        console.error("Failed to fetch cart items:", err);
        setErrorCart("Failed to load cart items.");
      })
      .finally(() => setLoadingCart(false));
  }, [user?._id, baseURL]);

  /* ------------------ FETCH USER ORDERS (for re-order) ------------------ */
  useEffect(() => {
    if (!user?._id) return;
    setLoadingOrders(true);
    axios
      .get(`${baseURL}/orders/user/${user._id}`)
      .then((res) => setUserOrders(res.data || []))
      .catch((err) => console.error("Failed to fetch user orders:", err))
      .finally(() => setLoadingOrders(false));
  }, [user?._id, baseURL]);

  /* ------------------ REMOVE ITEM ------------------ */
  const handleRemove = (index) => {
    if (!user?._id) return toast.error("User not authenticated");
    const item = cartItems[index];
    if (!item) return;

    axios
      .delete(`${baseURL}/cart/delete`, {
        data: { userId: user._id, mealId: item.mealId || item._id },
      })
      .then(() => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
        toast.success(`Removed ${item.title} from cart.`);
      })
      .catch((err) => {
        console.error("Failed to remove item:", err);
        toast.error("Failed to remove item.");
      });
  };

  /* ------------------ CLEAR CART ------------------ */
  const handleClearCart = () => {
    if (!user?._id) return toast.error("User not authenticated");
    axios
      .delete(`${baseURL}/cart/clear`, { data: { userId: user._id } })
      .then(() => {
        setCartItems([]);
        toast.success("Cart cleared.");
      })
      .catch((err) => {
        console.error("Failed to clear cart:", err);
        toast.error("Failed to clear cart.");
      });
  };

  /* ------------------ UPDATE QUANTITY ------------------ */
  const handleQuantity = (index, delta) => {
    if (!user?._id) return toast.error("User not authenticated");
    const item = cartItems[index];
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    setCartItems((prev) =>
      prev.map((i, idx) => (idx === index ? { ...i, quantity: newQuantity } : i))
    );

    axios
      .put(`${baseURL}/cart/update`, {
        userId: user._id,
        mealId: item.mealId || item._id,
        quantity: newQuantity,
      })
      .then(() => toast.success(`Updated quantity for ${item.title}.`))
      .catch((err) => {
        console.error("Failed to update quantity:", err);
        toast.error("Failed to update quantity.");
      });
  };

  /* ------------------ REORDER ------------------ */
  const handleReOrder = useCallback(
    async (order) => {
      if (!order?.meals?.length) return;
      const backendAddPromises = [];

      setCartItems((prev) => {
        const updated = [...prev];
        order.meals.forEach((m) => {
          const meal = m.mealId || m;
          const id = meal._id || m.mealId;
          const existing = updated.findIndex(
            (ci) => ci._id === id || ci.mealId === id
          );

          if (existing >= 0) {
            updated[existing].quantity += m.quantity || 1;
          } else {
            updated.push({
              _id: id,
              mealId: id,
              title: meal.title || "Meal",
              price: meal.price ?? 0,
              photo: meal.photo || "",
              quantity: m.quantity || 1,
            });
          }

          backendAddPromises.push(
            axios.post(`${baseURL}/cart/add`, {
              userId: user._id,
              item: { mealId: id, quantity: m.quantity || 1 },
            })
          );
        });
        return updated;
      });

      try {
        await Promise.all(backendAddPromises);
        toast.success("Reordered successfully!");
      } catch {
        toast.error("Failed to sync reorder to backend.");
      }
    },
    [user?._id, baseURL]
  );

  /* ------------------ Persist cart locally ------------------ */
  useEffect(() => {
    storage.setItem("cart", cartItems);
  }, [cartItems]);

  /* ------------------ Totals ------------------ */
  const total = useMemo(
    () =>
      cartItems.reduce(
        (acc, i) =>
          acc +
          (i.discountedPrice != null ? i.discountedPrice : i.price || 0) *
            i.quantity,
        0
      ),
    [cartItems]
  );
  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  const goCheckout = () => {
    if (!cartItems.length) return;
    const payload = cartItems.map((i) => ({
      mealId: i.mealId,
      title: i.title,
      price: i.discountedPrice != null ? i.discountedPrice : i.price,
      quantity: i.quantity,
      photo: i.photo,
    }));
    navigate("/checkout", { state: { cart: payload } });
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-200 px-4 py-10">
      {/* 🔙 Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="mb-6 flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow hover:bg-white transition"
      >
        <FaArrowLeft className="text-orange-600" />
        <span className="font-semibold text-gray-700">Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8"
      >
        {/* -------- Cart Items -------- */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-2xl text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Your Cart ({itemCount})
              </h2>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <FiTrash2 /> Clear
              </button>
            )}
          </div>

          {loadingCart ? (
            <p className="text-center text-gray-600">Loading cart items...</p>
          ) : errorCart ? (
            <p className="text-center text-red-600">{errorCart}</p>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🛒</p>
              <p className="text-gray-500 mb-6">Your cart is empty.</p>
              <button
                onClick={() => navigate("/meals")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition shadow-lg"
              >
                Browse Meals
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-orange-100">
              {cartItems.map((item, index) => (
                <motion.li
                  key={item._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-4 flex items-start sm:items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src={item.photo || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-gray-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-orange-600 font-medium text-sm">
                      ₹{item.discountedPrice ?? item.price} each
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantity(index, -1)}
                        className="p-1 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="w-6 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity(index, 1)}
                        className="p-1 w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <FaPlus size={10} />
                      </button>
                      <button
                        onClick={() => handleRemove(index)}
                        className="ml-4 flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-semibold"
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right font-semibold text-gray-800 min-w-[80px]">
                    ₹{(item.discountedPrice ?? item.price) * item.quantity}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* -------- Order Summary -------- */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">
                <p>Items ({itemCount})</p>
                <p>₹{total}</p>
              </div>
              <div className="flex justify-between">
                <p>Delivery</p>
                <p className="text-green-600">Free</p>
              </div>
            </div>
            <hr className="my-4 border-orange-200/60" />
            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6">
              <p>Total</p>
              <p>₹{total}</p>
            </div>
            <button
              disabled={!cartItems.length}
              onClick={goCheckout}
              className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                cartItems.length
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
