import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../context/userContext";
import Loading from "../Loading";
import { storage } from "../utils/Storage";
/* ------------------ Config ------------------ */
const UPI_APPS = [
  { key: "gpay",    label: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Pay_%28GPay%29_Logo_%282017-2020%29.svg/240px-Google_Pay_%28GPay%29_Logo_%282017-2020%29.svg.png" },
  { key: "phonepe", label: "PhonePe",    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.png/240px-PhonePe_Logo.png" },
  { key: "paytm",   label: "Paytm",      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/240px-Paytm_Logo_%28standalone%29.svg.png" },
  { key: "bhim",    label: "BHIM",       icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/BHIM_svg_logo.svg/240px-BHIM_svg_logo.svg.png" },
];

const PAYMENT_OPTIONS = [
  { key: "Cash on Delivery",  label: "Cash On Delivery", icon: "https://cdn-icons-png.flaticon.com/512/2454/2454287.png" },
  { key: "UPI",              label: "UPI",               icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/240px-UPI-Logo-vector.svg.png" },
  { key: "Credit/Debit Card",label: "Card",              icon: "https://cdn-icons-png.flaticon.com/512/179/179457.png" },
  { key: "Razorpay",         label: "Razorpay",          icon: "https://razorpay.com/favicon.png" },
];

const TIME_SLOTS = ["Lunch", "Dinner"];

/* ------------------ Anim Variants ------------------ */
const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.4, ease: "easeOut" },
  },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.35, ease: "easeOut" },
  },
});

/* ------------------ Component ------------------ */
const OrderNowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  /* ------------ State ------------ */
  const [meal, setMeal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    pincode: "",
  });
  const [paymentMode, setPaymentMode] = useState("Cash on Delivery");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [placing, setPlacing] = useState(false);

  // Payment detail sub-states
  const [upiApp, setUpiApp] = useState(null);
  const [upiId, setUpiId] = useState(""); // manual
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  /* ------------ Derived Tab from paymentMode ------------ */
  const activePaymentTab = useMemo(() => {
    if (paymentMode === "Credit/Debit Card") return "Card";
    if (paymentMode === "Razorpay") return "Razorpay";
    if (paymentMode === "UPI") return "UPI";
    return "COD";
  }, [paymentMode]);

  /* ------------ Fetch Meal ------------ */
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/meals/${id}`
        );
        setMeal(res.data);
      } catch {
        toast.error("Failed to fetch meal details.");
      }
    };
    fetchMeal();
  }, [id]);

  /* ------------ Autofill Address ------------ */
  useEffect(() => {
    if (user?.address?.length) {
      setDeliveryAddress(user.address[0]);
    }
  }, [user]);

  /* ------------ Total Price ------------ */
  useEffect(() => {
    if (meal) setTotalPrice(meal.price * quantity);
  }, [meal, quantity]);

  /* ------------ Add to Cart ------------ */
  const handleAddToCart = async () => {
  if (!meal) return;

   // assume user is stored after login
  if (!user || !user._id) {
    toast.error("Please login first!");
    return;
  }

  const item = {
    mealId: meal._id,
    title: meal.title,
    price: meal.price,
    quantity,
    photo: meal.photo,
  };

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, {
      userId: user._id,
      item,
    });

    // Optionally update localStorage or state if needed
    storage.setItem("cart", res.data.items); // optional
    toast.success("Added to cart 🛒");
  } catch {
    toast.error("Something went wrong!");
  }
};



  /* ------------ Razorpay SDK Loader ------------ */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ------------ Razorpay Flow ------------ */
  const handleRazorpayPay = async () => {
    if (!meal) return;
    try {
      const ok = await loadRazorpay();
      if (!ok) {
        toast.error("Razorpay SDK load failed");
        return;
      }
      // create razorpay order on server
      const createRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-order`,  // ✅ FIXED: was /payments/razorpay/order
        { amount: totalPrice * 100, currency: "INR" }
      );
      const rzpOrder = createRes.data.order || createRes.data;
      const { id: orderId, amount } = rzpOrder;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Tiffin Tales",
        description: meal.title,
        image: meal.photo,
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/payment/verify`,  // ✅ FIXED: was /payments/razorpay/verify
              response
            );
            toast.success("Payment successful!");
            setPaymentMode("Razorpay");
            setShowConfirmModal(true);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#e85d04" },
      };
      const rp = new window.Razorpay(options);
      rp.open();
    } catch {
      toast.error("Razorpay init failed");
    }
  };

  /* ------------ Place Order ------------ */
  const handlePlaceOrder = async () => {
    if (!user?._id) return toast.error("Please log in to place order.");
    if (
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    )
      return toast.error("Fill full address!");
    if (!timeSlot) return toast.error("Select a time slot.");

    // Payment validations
    if (paymentMode === "UPI" && !upiApp && !upiId)
      return toast.error("Select a UPI app or enter UPI ID.");
    if (paymentMode === "Credit/Debit Card") {
      if (
        !cardForm.name ||
        !cardForm.number ||
        !cardForm.expiry ||
        !cardForm.cvv
      ) {
        return toast.error("Enter complete card details.");
      }
    }

    setPlacing(true);
    try {
      const payload = {
        userId: user._id,
        chefId: meal?.chefId?._id || meal?.chefId,  // ✅ FIXED: safe access in case chefId not populated
        meals: [
          {
            mealId: meal._id,
            title: meal.title,
            price: meal.price,
            quantity,
          },
        ],
        totalPrice,
        deliveryAddress,
        paymentMode,
        paymentApp: upiApp,
        upiId,
        card: cardForm,
        timeSlot,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/`,  // ✅ confirmed correct route
        payload
      );
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch {
      toast.error("Order failed!");
    } finally {
      setShowConfirmModal(false);
      setPlacing(false);
    }
  };

  /* ------------ Render Payment Details ------------ */
  const renderPaymentDetails = () => {
    switch (paymentMode) {
      case "UPI":
        return (
          <motion.div {...fadeInUp(0.05)} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {UPI_APPS.map((u) => (
                <motion.button
                  key={u.key}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setUpiApp(u.key)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-xs sm:text-sm transition-all ${
                    upiApp === u.key
                      ? "border-orange-500 bg-orange-100 shadow-orange-200 shadow-md"
                      : "border-orange-200 hover:border-orange-400 bg-white/60"
                  }`}
                >
                  <img src={u.icon} alt={u.label} className="w-6 h-6 mb-1" />

                  {u.label}
                </motion.button>
              ))}
            </div>
            <input
              type="text"
              placeholder="or enter UPI ID (example@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-2 rounded-lg border border-orange-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </motion.div>
        );

      case "Credit/Debit Card":
        return (
          <motion.div
            {...fadeInUp(0.05)}
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Name on Card"
              value={cardForm.name}
              onChange={(e) =>
                setCardForm({ ...cardForm, name: e.target.value })
              }
              className="p-3 rounded-lg border border-orange-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 col-span-1 sm:col-span-2"
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardForm.number}
              onChange={(e) =>
                setCardForm({ ...cardForm, number: e.target.value })
              }
              className="p-3 rounded-lg border border-orange-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 col-span-1 sm:col-span-2"
              inputMode="numeric"
              maxLength={19}
            />
            <input
              type="text"
              placeholder="MM/YY"
              value={cardForm.expiry}
              onChange={(e) =>
                setCardForm({ ...cardForm, expiry: e.target.value })
              }
              className="p-3 rounded-lg border border-orange-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
              maxLength={5}
            />
            <input
              type="password"
              placeholder="CVV"
              value={cardForm.cvv}
              onChange={(e) =>
                setCardForm({ ...cardForm, cvv: e.target.value })
              }
              className="p-3 rounded-lg border border-orange-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400"
              maxLength={4}
            />
            <div className="col-span-1 sm:col-span-2 text-xs text-gray-500 text-center sm:text-left">
              Card details are not stored. Processed securely.
            </div>
          </motion.div>
        );

      case "Razorpay":
        return (
          <motion.div
            {...scaleIn(0.05)}
            className="mt-4 p-4 rounded-xl border-2 border-dashed border-orange-300 text-center"
          >
            <p className="mb-3 text-sm text-gray-700">
              You’ll be redirected to Razorpay secure payment.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(59,130,246,.4)",
              }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleRazorpayPay}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg"
            >
              Pay with Razorpay
            </motion.button>
          </motion.div>
        );

      case "Cash on Delivery":
      default:
        return (
          <motion.p
            {...fadeInUp(0.05)}
            className="mt-4 text-green-700 text-sm font-semibold text-center"
          >
            Pay cash to delivery partner. 👍
          </motion.p>
        );
    }
  };

  /* ------------ Landscape Layout ------------- */
  // On md+ screens, we show a 2-col layout: preview panel left + scroll form right
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 flex justify-center items-center px-4 py-8">
      <Toaster position="top-right" />

      <div className="w-full max-w-5xl grid md:grid-cols-[1fr_1.2fr] gap-8 items-start">
        {/* ---------- Meal Preview Panel (Sticky in landscape) ---------- */}
        <AnimatePresence>
          {meal ? (
            <motion.aside
              key="aside"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="hidden md:block sticky top-8 self-start backdrop-blur-2xl bg-white/30 border border-white/40 shadow-xl rounded-3xl p-6"
            >
              <h3 className="text-xl font-bold text-orange-700 mb-4 text-center">
                You're Ordering
              </h3>
              <div className="relative mb-4 overflow-hidden rounded-2xl">
                <img
                  src={meal.photo}
                  alt={meal.title}
                  className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/10 to-transparent" />
              </div>
              <p className="font-semibold text-lg text-gray-800 text-center">
                {meal.title}
              </p>
              <p className="text-orange-600 font-medium text-center mt-1">
                ₹{meal.price} × {quantity}
              </p>
              <hr className="my-4 border-orange-200/60" />
              <p className="text-center text-2xl font-extrabold text-green-700">
                Total: ₹{totalPrice}
              </p>
            </motion.aside>
          ) : (
            <div className="hidden md:flex justify-center items-center p-6">
              <Loading />
            </div>
          )}
        </AnimatePresence>

        {/* ---------- Main Card (Mobile: full; Desktop: right col) ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-2xl bg-white/20 border border-white/40 shadow-2xl rounded-3xl p-6 w-full max-w-lg mx-auto relative overflow-hidden"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.3)",
          }}
        >
          {/* glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-orange-400/20 blur-xl -z-10" />

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent text-center mb-4"
          >
            🚀 Checkout
          </motion.h2>

          {/* Meal Snapshot (shown on mobile since aside hidden) */}
          <AnimatePresence>
            {!meal ? (
              <div className="flex justify-center py-8">
                <Loading />
              </div>
            ) : (
              <motion.div
                key="mobmeal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="md:hidden flex items-center gap-4 mb-4 p-3 bg-white/30 rounded-2xl backdrop-blur-md border border-white/50"
              >
                <motion.img
                  src={meal.photo}
                  alt={meal.title}
                  className="w-20 h-20 rounded-xl object-cover shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                />
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {meal.title}
                  </p>
                  <p className="text-orange-600 font-medium">
                    ₹{meal.price} × {quantity}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quantity */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp(0.2)}
            className="flex justify-center items-center gap-6 mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-300 to-orange-500 text-white font-bold rounded-full shadow-lg"
            >
              −
            </motion.button>
            <motion.span
              key={quantity}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center"
            >
              {quantity}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 text-white font-bold rounded-full shadow-lg"
            >
              +
            </motion.button>
          </motion.div>

          {/* Total */}
          <motion.p
            key={totalPrice}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-2xl font-bold text-orange-600 mb-4 drop-shadow"
            style={{ textShadow: "0 0 12px rgba(255,165,0,.3)" }}
          >
            Total: ₹{totalPrice}
          </motion.p>

          {/* Address */}
          <motion.div {...fadeInUp(0.25)} className="space-y-2 mb-4">
            <h3 className="text-base font-semibold text-gray-700">
              📍 Delivery Address
            </h3>
            {["street", "city", "pincode"].map((field, i) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={deliveryAddress[field]}
                onChange={(e) =>
                  setDeliveryAddress({
                    ...deliveryAddress,
                    [field]: e.target.value,
                  })
                }
                className="w-full p-2 rounded-xl border border-orange-200/50 bg-white/40 backdrop-blur-md text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent focus:bg-white/60 transition-all duration-300 text-sm"
              />
            ))}
          </motion.div>

          {/* Payment Tabs */}
          <motion.div {...fadeInUp(0.3)} className="mb-4">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              💳 Payment Method
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {PAYMENT_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPaymentMode(opt.key)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    paymentMode === opt.key
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-white/50 text-gray-600 hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={opt.icon} alt={opt.label} className="w-5 h-5" />
                    <span>{opt.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Dynamic Payment Detail UI */}
            {renderPaymentDetails()}
          </motion.div>

          {/* Time Slot */}
          <motion.div {...fadeInUp(0.35)} className="mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              🕐 Delivery Time
            </h3>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-2 rounded-xl border border-orange-200/50 bg-white/40 backdrop-blur-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent focus:bg-white/60 transition-all duration-300 text-sm"
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md text-sm"
            >
              🛒 Add to Cart
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                paymentMode === "Razorpay"
                  ? handleRazorpayPay()
                  : setShowConfirmModal(true)
              }
              disabled={placing}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold shadow-md text-sm disabled:opacity-60"
            >
              {placing ? "Processing..." : "Confirm & Checkout"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-80 text-center border border-white/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-orange-400/20 rounded-3xl blur-xl -z-10" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="text-5xl mb-3"
              >
                🎉
              </motion.div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                Confirm Your Order?
              </h3>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlaceOrder}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md text-sm"
                >
                  ✅ Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-md text-sm"
                >
                  ❌ Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderNowPage;
