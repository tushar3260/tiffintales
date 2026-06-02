// Cart.jsx — Production Ready
// Uses CartContext for real-time sync, TopNav, premium UI
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { FaMinus, FaPlus, FaShoppingCart, FaLeaf, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../context/userContext";
import { useCart } from "../context/CartContext";
import TopNav from "../components/TopNav.jsx";
import BackButton from "../components/BackButton.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { cartItems, loading, error, updateQuantity, removeItem, clearAllItems, cartTotal } = useCart();

  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0),
    [cartItems]
  );

  const goCheckout = () => {
    if (!cartItems.length) return;
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    const payload = cartItems.map((i) => ({
      mealId: i.mealId || i._id,
      chefId: i.chefId,
      title: i.title,
      price: i.discountedPrice != null ? i.discountedPrice : i.price,
      quantity: i.quantity,
      photo: i.photo,
    }));
    navigate("/checkout", { state: { cart: payload } });
  };

  return (
    <>
      <Toaster position="top-right" />
      <TopNav
        onLoginClick={() => navigate("/login")}
        onSignupClick={() => navigate("/signup")}
      />

      <div className="min-h-screen bg-[#0f0f1a] pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
          <BackButton fallback="/meals" label="Back" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100 flex items-center gap-2">
                <FaShoppingCart className="text-orange-500" /> Your Cart
                {itemCount > 0 && (
                  <span className="text-base font-semibold text-gray-500">({itemCount} items)</span>
                )}
              </h1>
              <p className="text-gray-600 text-sm">Review your items before checkout</p>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-5"
            >
              <div className="text-7xl">🛒</div>
              <p className="text-xl font-bold text-gray-400">Your cart is empty</p>
              <p className="text-gray-600 text-sm">Add some delicious homemade meals!</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/meals")}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg hover:shadow-xl transition"
              >
                Browse Meals 🍱
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_340px] gap-6">

              {/* ── Cart Items ── */}
              <div className="bg-[#1e1e30] rounded-3xl shadow-xl border border-white/5 overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-[#252540] text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/5">
                  <span>Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Subtotal</span>
                  <span />
                </div>

                <AnimatePresence>
                  {cartItems.map((item, index) => {
                    const unitPrice = item.discountedPrice ?? item.price ?? 0;
                    const subtotal = unitPrice * (item.quantity || 1);

                    return (
                      <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] items-start sm:items-center gap-4 px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/2 transition"
                      >
                        {/* Item Info */}
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-md border border-white/10">
                            <img
                              src={item.photo || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"; }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-200 truncate text-sm sm:text-base">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-orange-500 font-semibold text-sm">₹{unitPrice}</span>
                              {item.discountedPrice != null && item.discountedPrice < item.price && (
                                <span className="text-xs text-gray-400 line-through">₹{item.price}</span>
                              )}
                              {item.tags?.includes("Veg") && (
                                <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
                                  <FaLeaf className="text-green-500" /> Veg
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-start sm:justify-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.mealId || item._id, (item.quantity || 1) - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#252540] hover:bg-[#2e2e50] transition text-gray-400"
                          >
                            <FaMinus size={9} />
                          </motion.button>
                          <span className="w-8 text-center font-bold text-gray-200 text-sm">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.mealId || item._id, (item.quantity || 1) + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white transition"
                          >
                            <FaPlus size={9} />
                          </motion.button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="font-bold text-gray-200">₹{subtotal}</p>
                        </div>

                        {/* Remove */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.mealId || item._id)}
                          className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="Remove item"
                        >
                          <FiTrash2 size={15} />
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Clear Cart Footer */}
                <div className="px-6 py-3 bg-[#252540] border-t border-white/5 flex justify-end">
                  <button
                    onClick={clearAllItems}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1 transition"
                  >
                    <FiTrash2 size={12} /> Clear all items
                  </button>
                </div>
              </div>

              {/* ── Order Summary ── */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-[#1e1e30] rounded-3xl shadow-xl border border-white/5 p-6">
                  <h3 className="text-lg font-bold text-gray-100 mb-5 flex items-center gap-2">
                    🧾 Order Summary
                  </h3>

                  <div className="space-y-3 mb-5">
                    {cartItems.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex-1 truncate mr-2">
                          {item.title} <span className="text-gray-600">×{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-200">
                          ₹{(item.discountedPrice ?? item.price ?? 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-5">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>🚚 Delivery</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-base font-bold text-gray-200">Total</span>
                      <span className="text-xl font-extrabold text-orange-600">₹{cartTotal}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={!cartItems.length}
                    onClick={goCheckout}
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                      cartItems.length
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Proceed to Checkout →
                  </motion.button>

                  <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                    <FaLock className="text-green-500" /> Secured & encrypted checkout
                  </div>

                  <button
                    onClick={() => navigate("/meals")}
                    className="w-full mt-3 py-2.5 text-center text-sm text-orange-600 font-semibold hover:underline transition"
                  >
                    + Add more items
                  </button>
                </div>

                {/* Promo placeholder */}
                <div className="mt-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-md">
                  <p className="font-bold text-sm">🎉 Free delivery on all orders!</p>
                  <p className="text-xs text-orange-100 mt-1">Support local home chefs. Fresh food daily.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
