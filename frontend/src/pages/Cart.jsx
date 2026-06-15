// Cart.jsx — Premium Light Theme
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { FaMinus, FaPlus, FaShoppingCart, FaLeaf, FaLock, FaArrowRight } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../context/userContext";
import { useCart } from "../context/CartContext";
import TopNav from "../components/TopNav.jsx";
import BackButton from "../components/BackButton.jsx";

const Cart = () => {
  const navigate  = useNavigate();
  const { user }  = useUser();
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
      mealId:  i.mealId || i._id,
      chefId:  i.chefId,
      title:   i.title,
      price:   i.discountedPrice != null ? i.discountedPrice : i.price,
      quantity: i.quantity,
      photo:   i.photo,
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

      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <BackButton fallback="/meals" label="Back" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
                <FaShoppingCart className="text-orange-500 text-2xl" />
                Your Cart
                {itemCount > 0 && (
                  <span className="text-base font-semibold text-gray-400">({itemCount} items)</span>
                )}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">Review your items before checkout</p>
            </div>
          </motion.div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="spinner" />
            </div>

          /* Empty State */
          ) : cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-5"
            >
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center">
                <HiOutlineShoppingCart className="text-4xl text-orange-400" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">Your cart is empty</p>
                <p className="text-gray-500 text-sm mt-1">Add some delicious homemade meals to get started</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/meals")}
                className="btn btn-primary btn-lg"
              >
                Browse Meals <FaArrowRight />
              </motion.button>
            </motion.div>

          /* Cart Items + Summary */
          ) : (
            <div className="grid lg:grid-cols-[1fr_340px] gap-6">

              {/* Cart Items */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                  {["Item", "Qty", "Subtotal", ""].map((h, i) => (
                    <span key={i} className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${i === 2 ? "text-right" : ""}`}>{h}</span>
                  ))}
                </div>

                <AnimatePresence>
                  {cartItems.map((item, index) => {
                    const unitPrice = item.discountedPrice ?? item.price ?? 0;
                    const subtotal  = unitPrice * (item.quantity || 1);

                    return (
                      <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0, padding: 0 }}
                        transition={{ duration: 0.22 }}
                        className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] items-start sm:items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Item Info */}
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
                            <img
                              src={item.photo || "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"; }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{item.title}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-orange-500 font-bold text-sm">₹{unitPrice}</span>
                              {item.discountedPrice != null && item.discountedPrice < item.price && (
                                <span className="text-xs text-gray-400 line-through">₹{item.price}</span>
                              )}
                              {item.tags?.includes("Veg") && (
                                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                                  <FaLeaf className="text-emerald-500" /> Veg
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:justify-center">
                          <button
                            onClick={() => updateQuantity(item.mealId || item._id, (item.quantity || 1) - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="w-7 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.mealId || item._id, (item.quantity || 1) + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="sm:text-right">
                          <p className="font-bold text-gray-900">₹{subtotal}</p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.mealId || item._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Clear Cart Footer */}
                <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={clearAllItems}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <FiTrash2 size={11} /> Clear all items
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 h-fit space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-5 h-5 bg-orange-100 rounded-md flex items-center justify-center">
                      <FaShoppingCart className="text-orange-500 text-xs" />
                    </span>
                    Order Summary
                  </h3>

                  {/* Items */}
                  <div className="space-y-2.5 mb-5">
                    {cartItems.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 flex-1 truncate mr-2">
                          {item.title} <span className="text-gray-400">×{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-800">
                          ₹{(item.discountedPrice ?? item.price ?? 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-5">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-600 font-semibold">
                      <span>Delivery</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-black text-orange-600">₹{cartTotal}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={!cartItems.length}
                    onClick={goCheckout}
                    className={`btn w-full btn-lg ${cartItems.length ? "btn-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                  >
                    Proceed to Checkout <FaArrowRight />
                  </motion.button>

                  {/* Security note */}
                  <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                    <FaLock className="text-emerald-500" /> Secured & encrypted checkout
                  </div>

                  {/* Add more */}
                  <button
                    onClick={() => navigate("/meals")}
                    className="w-full mt-3 py-2 text-center text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                  >
                    + Add more items
                  </button>
                </div>

                {/* Promo Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <RiSecurePaymentLine className="text-lg" />
                    <p className="font-bold text-sm">Free delivery on all orders!</p>
                  </div>
                  <p className="text-xs text-orange-100">Support local home chefs. Fresh food daily.</p>
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
