// Checkout.jsx — Premium Light Theme, Production Ready
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt, FaClock, FaShieldAlt, FaCheckCircle,
  FaArrowLeft, FaPlus, FaCreditCard, FaArrowRight,
} from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlineLocationMarker } from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";

const BASE       = import.meta.env.VITE_API_URL;
const TIME_SLOTS = ["Breakfast (7-9 AM)", "Lunch (12-2 PM)", "Dinner (7-9 PM)"];

function DeliveryMap({ address }) {
  if (!address?.city) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 mt-3 h-40">
      <iframe
        title="Delivery Location"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=77.0,28.4,77.4,28.8&layer=mapnik&marker=28.6,77.2`}
        className="w-full h-full"
        loading="lazy"
        style={{ border: 0 }}
      />
    </div>
  );
}

const Checkout = () => {
  const { state }      = useLocation();
  const navigate       = useNavigate();
  const { user, token } = useUser();
  const { clearAllItems } = useCart();
  const [paying, setPaying]               = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [addresses, setAddresses]         = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [instructions, setInstructions]   = useState("");

  const cartItems     = state?.cart || [];
  const totalAmount   = cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const authHeader    = token ? { Authorization: `Bearer ${token}` } : {};

  // ✅ resolvedChefId — comes from cart item OR is fetched from Meal API (handles old cart data)
  const [resolvedChefId, setResolvedChefId] = useState(cartItems[0]?.chefId || null);

  // Fetch addresses
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${BASE}/user/${user._id}/address`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.addresses || [];
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]);
      })
      .catch(() => {});
  }, [user]);

  // ✅ If chefId missing from cart (old data) — fetch it from the Meal API
  useEffect(() => {
    const firstItem = cartItems[0];
    if (!firstItem) return;
    // Already have chefId — no need to fetch
    if (firstItem.chefId) {
      setResolvedChefId(firstItem.chefId);
      return;
    }
    // Missing — fetch from Meal API
    const mealId = firstItem.mealId || firstItem._id;
    if (!mealId) return;
    axios
      .get(`${BASE}/meals/${mealId}`)
      .then((res) => {
        const chef = res.data?.chefId?._id || res.data?.chefId;
        if (chef) setResolvedChefId(chef);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload  = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!user?._id)        return toast.error("Please login first.");
    if (!cartItems.length) return toast.error("Your cart is empty.");
    if (!resolvedChefId)   return toast.error("Chef info not found. Please try again in a moment.");
    if (!selectedAddress)  return toast.error("Please select a delivery address.");

    setPaying(true);
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error("Payment SDK failed to load. Check your internet.");
        setPaying(false);
        return;
      }

      const { data } = await axios.post(
        `${BASE}/payment/create-order`,
        { amount: totalAmount, currency: "INR" },
        { headers: authHeader }
      );
      const rzpOrder = data.order || data;

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      rzpOrder.amount,
        currency:    rzpOrder.currency || "INR",
        name:        "Tiffin Tales",
        description: `${cartItems.length} item(s) · ${selectedTimeSlot}`,
        order_id:    rzpOrder.id,
        image:       "https://cdn-icons-png.flaticon.com/512/2515/2515263.png",
        prefill: {
          name:    user.fullName || user.name || "Tiffin Tales User",
          email:   user.email || "",
          contact: user.phone || "",
        },
        theme: { color: "#F97316" },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${BASE}/payment/verify`,
              {
                razorpay_payment_id:  response.razorpay_payment_id,
                razorpay_order_id:    response.razorpay_order_id,
                razorpay_signature:   response.razorpay_signature,
              },
              { headers: authHeader }
            );

            if (verifyRes.data.success) {
              await axios.post(
                `${BASE}/orders/`,
                {
                  userId: user._id,
                  chefId: resolvedChefId,
                  meals:  cartItems.map((item) => ({
                    mealId:   item.mealId || item._id,
                    quantity: item.quantity || 1,
                    price:    item.price || 0,
                  })),
                  totalPrice:      totalAmount,
                  deliveryAddress: {
                    street:  selectedAddress.street  || selectedAddress.addressLine || "Not provided",
                    city:    selectedAddress.city    || "Not provided",
                    pincode: selectedAddress.pincode || "000000",
                  },
                  paymentMode:    "Online",
                  timeSlot:       selectedTimeSlot,
                  paymentStatus:  "Paid",
                  instructions,
                },
                { headers: authHeader }
              );
              await clearAllItems();
              toast.success("Order placed! Bon Appétit!");
              navigate("/orders");
            } else {
              toast.error("Payment verification failed. Contact support.");
            }
          } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong after payment.");
          } finally {
            setPaying(false);
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.on("payment.failed", (res) => {
        toast.error(`Payment failed: ${res.error.description}`);
        setPaying(false);
      });
      razor.open();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to initiate payment.");
      setPaying(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-5">
        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center">
          <FaCreditCard className="text-3xl text-orange-400" />
        </div>
        <p className="text-2xl font-bold text-gray-800">Your cart is empty</p>
        <p className="text-gray-500">Add some meals before checking out</p>
        <button onClick={() => navigate("/meals")} className="btn btn-primary btn-lg">
          Browse Meals <FaArrowRight />
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 text-sm font-semibold transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── LEFT: Delivery Details ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6"
              >
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-orange-500 text-xs" />
                  </span>
                  Delivery Address
                </h2>

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddress?._id === addr._id
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1 accent-orange-500"
                          checked={selectedAddress?._id === addr._id}
                          onChange={() => setSelectedAddress(addr)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{addr.tag || "Saved Address"}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {addr.street}, {addr.city}{addr.pincode && ` - ${addr.pincode}`}
                          </p>
                        </div>
                        {selectedAddress?._id === addr._id && (
                          <FaCheckCircle className="text-orange-500 flex-shrink-0 mt-0.5" />
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HiOutlineLocationMarker className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-4">No saved addresses. Add one to continue.</p>
                    <button
                      onClick={() => navigate("/profile")}
                      className="btn btn-outline btn-sm"
                    >
                      <FaPlus className="text-xs" /> Add Address
                    </button>
                  </div>
                )}

                {selectedAddress && <DeliveryMap address={selectedAddress} />}
              </motion.div>

              {/* Time Slot */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6"
              >
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaClock className="text-orange-500 text-xs" />
                  </span>
                  Choose Delivery Slot
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedTimeSlot === slot
                          ? "border-orange-400 bg-orange-50 text-orange-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6"
              >
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                    <HiOutlineDocumentText className="text-gray-500 text-sm" />
                  </span>
                  Special Instructions
                  <span className="text-xs font-normal text-gray-400">(Optional)</span>
                </h2>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Less spicy, extra roti, ring the bell..."
                  className="input-field resize-none text-sm"
                />
              </motion.div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 sticky top-6">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaCreditCard className="text-gray-500 text-xs" />
                  </span>
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-2.5 mb-5">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-md text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                          {item.quantity}
                        </span>
                        <span className="text-gray-500 truncate">{item.title}</span>
                      </div>
                      <span className="font-semibold text-gray-800 ml-2">
                        ₹{(item.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-600 font-semibold">
                    <span>Delivery</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-orange-600">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Slot & Address Summary */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-gray-600 mb-5 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <FaClock className="text-orange-500" /> {selectedTimeSlot}
                  </p>
                  {selectedAddress && (
                    <p className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-orange-500" />
                      {selectedAddress.city || "Address selected"}
                    </p>
                  )}
                </div>

                {/* Pay Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={paying || !selectedAddress}
                  className={`btn w-full btn-lg ${
                    paying || !selectedAddress
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "btn-primary"
                  }`}
                >
                  <FaCreditCard />
                  {paying ? "Processing..." : `Pay ₹${totalAmount}`}
                </motion.button>

                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                  <RiSecurePaymentLine className="text-emerald-500 text-base" />
                  100% Secure · Powered by Razorpay
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
