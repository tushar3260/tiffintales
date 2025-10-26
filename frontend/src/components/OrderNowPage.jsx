import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../context/userContext";
import Loading from "../Loading";
import { storage } from "../utils/Storage";
/* ------------------ Config ------------------ */
const UPI_APPS = [
  { key: "gpay", label: "Google Pay", icon: "data:image/png;base64,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" },
  { key: "phonepe", label: "PhonePe", icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEVfJZ////9ZF5xcIJ5zQatkJqOcg8BbHJ2GY7Tr4/NPAJf29flWDppdIp5VCZq8qdVyR6mihsaslMvMvt/m3u/XzOaRb7vt5/TArtdkLKJVAJvIuNz18fnh2Oz8+v6LareZfb9mMKNzRapqN6V+VrC0n9CFXrSWdr6ul8yki8Z7Tq/c0ul5T63Kvd3VmfStAAADYklEQVR4nO3cYVfaMBiG4TSRVUISwAKlWASp6ED3///eiu5MyZvtKKc7Td4912c/5D4U06QNQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQml8YZafsexr+SO7e5WRbLbeUYNtrc6c1tnb26W5q87wF1zLpqUWQf1Dteifa+uMvOlZXqe1RdckVGrDWn76Ke0cKs0H0Pq0Pq6F+kJ0vX97g6JHejQOINr8Q6kLgxfY+rQ3lTBhIfZN/j6lBeBRJHrKbFvAr8Ry0FpzlDiTVNnLGaFtVqThOLVd/D6pINJY55JZrA/duB07TYfoq3NHHBaVps71GXzKfFNnFMCuuG07TYrqX2dFrMOc0Z7ad4IIlrZjs3ekqnRU6rxZbbksQ9s0SzIIlTVtNim/jIfVpsE8nOxo7XtCgkSazveU2LQk78nY2hYLWJ2iY2fuI8pWnRfoIkmze32ryL+prN9eAz6OZNMf5t/6jjvWjzazIXXGIW7x25C+zIXKJuYv0U5bCbwvZfT98pf9BZYXaM9EPsrvAp0m9id4XTSO/kDPvC0L4or0JJV7jMCoV57qhwG2uhVaFH9xe4inS2aBP19rkevfLGPKK8v5i/35pGvWKUK/3q4Xz4Q00M/CvzfYGRwmLKvwkfki+WuvIKv8X63QtDIQrjh0IUxg+FKIwfClEYPxSiMH4oRGH8/oNC78WZkl2hejkffk1eQ0y+cOK9NkPOH6ReaCuvkDzzTL1QrLwt7e/+62vJF/qHD2f+a5bJFzr/7fxrLyD5Qum/81yq829i8oW28QKydfUxwZr7xAuFJocr64U2Ulmlcmn04OA/akyu0NADFlm5PLw0x+PjYRl4kppcodrRiL9KrvDLD/XTK5T0xXxmhcJ97UNMsFBNuBcKd8O9UOjA2VFehcGzo6wKhXWBeZ9VYbtO3IZ+4IRToZAicASYVWF7pQ7G9McxyrF/jC3dwtNKyVzv1+Wvy3VUzorpi1ulvj705MbZZnKya4RxUqW/AqZsuzI8sW/7igwLPShMHwrTh8L0oTB9KEyfrbgXCnfHvrDgXug/2OBXKMz5ryptYj6wdiG3+bC7sWb2SzxvpHr6MX8zVikcyfs6K90vSZw5BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAT/oJwzc2OGhRkc4AAAAASUVORK5CYII=" },
  { key: "paytm", label: "Paytm", icon: "data:image/png;base64,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" },
  { key: "bhim", label: "BHIM", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDKrOdSzeS-AFLVjWpfGmgTZUV1tDU2tI0YQ&s" },
];

const PAYMENT_OPTIONS = [
  { key: "Cash on Delivery", label: "Cash On Delivery", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmVofx_lOy37FjukSIEQDNX00qzOcYY2SoAA&s" },
  { key: "UPI", label: "UPI", icon: "data:image/jpeg;base64,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" },
  { key: "Credit/Debit Card", label: "Card", icon: "data:image/png;base64,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" },
  { key: "Razorpay", label: "Razorpay", icon: "data:image/jpeg;base64,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" },
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
      } catch (err) {
        toast.error("Failed to fetch meal details.");
        console.error(err);
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
  } catch (error) {
    console.error("Add to cart error:", error);
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
        `${import.meta.env.VITE_API_URL}/payments/razorpay/order`,
        { amount: totalPrice * 100, currency: "INR" }
      );
      const { orderId, amount } = createRes.data; // adjust if backend differs

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
              `${import.meta.env.VITE_API_URL}/payments/razorpay/verify`,
              response
            );
            toast.success("Payment successful!");
            setPaymentMode("Razorpay");
            setShowConfirmModal(true);
          } catch (err) {
            toast.error("Payment verification failed");
            console.error(err);
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
    } catch (err) {
      toast.error("Razorpay init failed");
      console.error(err);
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
        chefId: meal.chefId._id,
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
        `${import.meta.env.VITE_API_URL}/orders/`,
        payload
      );
      toast.success("Order placed successfully!");
      console.log("✅ Order:", res.data);
    } catch (err) {
      toast.error("Order failed!");
      console.error(err);
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
