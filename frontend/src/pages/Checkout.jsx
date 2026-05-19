// Checkout.jsx — Production Ready
// Features: Address selection, time slot, order summary, Razorpay payment
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt, FaClock, FaShieldAlt, FaCheckCircle,
  FaArrowLeft, FaPlus, FaCreditCard,
} from "react-icons/fa";

const BASE = import.meta.env.VITE_API_URL;
const TIME_SLOTS = ["Breakfast (7-9 AM)", "Lunch (12-2 PM)", "Dinner (7-9 PM)"];

// Simplified inline map using OpenStreetMap iframe (no npm needed)
function DeliveryMap({ address }) {
  if (!address?.city) return null;
  const query = encodeURIComponent(
    [address.street, address.city, address.pincode].filter(Boolean).join(", ")
  );
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 mt-3 h-40">
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
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, token } = useUser();
  const { clearAllItems } = useCart();
  const [paying, setPaying] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [step, setStep] = useState(1); // 1=details, 2=payment

  const cartItems = state?.cart || [];
  const totalAmount = cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const selectedChefId = cartItems[0]?.chefId || null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch saved addresses
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

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!user?._id) return toast.error("Please login first.");
    if (!cartItems.length) return toast.error("Your cart is empty.");
    if (!selectedChefId) return toast.error("Chef info missing from cart item.");
    if (!selectedAddress) return toast.error("Please select a delivery address.");

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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || "INR",
        name: "Tiffin Tales",
        description: `${cartItems.length} item(s) · ${selectedTimeSlot}`,
        order_id: rzpOrder.id,
        image: "https://cdn-icons-png.flaticon.com/512/2515/2515263.png",
        prefill: {
          name: user.fullName || user.name || "Tiffin Tales User",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: { color: "#F97316" },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${BASE}/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: authHeader }
            );

            if (verifyRes.data.success) {
              await axios.post(
                `${BASE}/orders/`,
                {
                  userId: user._id,
                  chefId: selectedChefId,
                  meals: cartItems.map((item) => ({
                    mealId: item.mealId || item._id,
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                  })),
                  totalPrice: totalAmount,
                  deliveryAddress: {
                    street: selectedAddress.street || selectedAddress.addressLine || "Not provided",
                    city: selectedAddress.city || "Not provided",
                    pincode: selectedAddress.pincode || "000000",
                  },
                  paymentMode: "Online",
                  timeSlot: selectedTimeSlot,
                  paymentStatus: "Paid",
                  instructions,
                },
                { headers: authHeader }
              );
              await clearAllItems();
              toast.success("🎉 Order placed! Bon Appétit!");
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f1a] gap-5">
        <div className="text-6xl">🛒</div>
        <p className="text-2xl font-bold text-gray-300">Your cart is empty</p>
        <button
          onClick={() => navigate("/meals")}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
        >
          Browse Meals 🍱
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[#0f0f1a] py-10 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-orange-400 mb-6 font-semibold transition"
          >
            <FaArrowLeft /> Back to Cart
          </button>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* ── LEFT: Delivery Details ── */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1e1e30] rounded-2xl shadow-xl p-5 sm:p-6 border border-white/5"
              >
                <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500" /> Delivery Address
                </h2>

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddress?._id === addr._id
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-white/10 hover:border-orange-400/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1 accent-orange-500"
                          checked={selectedAddress?._id === addr._id}
                          onChange={() => setSelectedAddress(addr)}
                        />
                        <div>
                          <p className="font-semibold text-gray-200">
                            {addr.tag || "Address"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {addr.street}, {addr.city}
                            {addr.pincode && ` - ${addr.pincode}`}
                          </p>
                        </div>
                        {selectedAddress?._id === addr._id && (
                          <FaCheckCircle className="ml-auto text-orange-500 mt-1 flex-shrink-0" />
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm mb-3">
                      No saved addresses. Add one to continue.
                    </p>
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-2 mx-auto bg-orange-500 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-orange-600 transition"
                    >
                      <FaPlus /> Add Address
                    </button>
                  </div>
                )}

                {selectedAddress && <DeliveryMap address={selectedAddress} />}
              </motion.div>

              {/* Time Slot */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1e1e30] rounded-2xl shadow-xl p-5 sm:p-6 border border-white/5"
              >
                <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <FaClock className="text-orange-500" /> Choose Delivery Slot
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedTimeSlot === slot
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-white/10 text-gray-400 hover:border-orange-400/40"
                      }`}
                    >
                      {slot.includes("Breakfast") ? "🌅 " : slot.includes("Lunch") ? "☀️ " : "🌙 "}
                      {slot}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#1e1e30] rounded-2xl shadow-xl p-5 sm:p-6 border border-white/5"
              >
                <h2 className="text-base font-bold text-gray-100 mb-3">
                  📝 Special Instructions (Optional)
                </h2>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Less spicy, extra roti, ring the bell..."
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none bg-[#252540] text-gray-200 placeholder-gray-600"
                />
              </motion.div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-[#1e1e30] rounded-2xl shadow-xl p-5 sm:p-6 border border-white/5 sticky top-6">
                <h2 className="text-lg font-bold text-gray-100 mb-5">🧾 Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-5">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                          {item.quantity}
                        </span>
                        <span className="text-gray-400 truncate max-w-[140px]">{item.title}</span>
                      </div>
                      <span className="font-semibold text-gray-200">
                        ₹{(item.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 font-semibold">
                    <span>🚚 Delivery</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-gray-100 pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-orange-600">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Slot & Address Summary */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-xs text-gray-400 mb-5 space-y-1">
                  <p><FaClock className="inline text-orange-500 mr-1" /> {selectedTimeSlot}</p>
                  {selectedAddress && (
                    <p><FaMapMarkerAlt className="inline text-orange-500 mr-1" />
                      {selectedAddress.city || "Address selected"}
                    </p>
                  )}
                </div>

                {/* Pay Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePayment}
                  disabled={paying || !selectedAddress}
                  className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                    paying || !selectedAddress
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
                  }`}
                >
                  <FaCreditCard />
                  {paying ? "Processing..." : `Pay ₹${totalAmount}`}
                </motion.button>

                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                  <FaShieldAlt className="text-green-500" />
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
