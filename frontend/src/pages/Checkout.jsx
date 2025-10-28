import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";

const Checkout = () => {
  const { state } = useLocation(); // cart items passed from Cart.jsx
  const navigate = useNavigate();
  const { user } = useUser();

  const cartItems = state?.cart || [];
  const totalAmount = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const selectedChefId = cartItems[0]?.chefId || null;
  const selectedTimeSlot = "Lunch";

  // ✅ Main payment handler
  const handlePayment = async () => {
    try {
      // 1️⃣ Create Razorpay order on backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-order`,
        { amount: totalAmount }
      );

      const { order } = data;

      // 2️⃣ Razorpay config
      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Tiffin Tales",
        description: "Order Payment",
        order_id: order.id,
        prefill: {
          name: user.name || "Tiffin Tales User",
          email: user.email || "tiffin@example.com",
          contact: user.phone || "0000000000",
        },
        theme: { color: "#F97316" },

        // 3️⃣ Razorpay payment success callback
        handler: async function (response) {
          try {
            // 4️⃣ Verify payment on backend
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              // 5️⃣ Create order in DB
              const orderData = {
                userId: user._id,
                chefId: selectedChefId,
                meals: cartItems.map((item) => ({
                  mealId: item._id,
                  quantity: item.quantity,
                  price: item.price,
                })),
                totalPrice: totalAmount,
                deliveryAddress: {
                  street: user.address?.street || "Not provided",
                  city: user.address?.city || "Not provided",
                  pincode: user.address?.pincode || "000000",
                },
                paymentMode: "Online",
                timeSlot: selectedTimeSlot,
                paymentStatus: "Paid",
              };

              await axios.post(
                `${import.meta.env.VITE_API_URL}/orders/placeOrder`,
                orderData
              );

              // 6️⃣ Clear cart
              await axios.delete(
                `${import.meta.env.VITE_API_URL}/cart/clear/${user._id}`
              );

              // 7️⃣ Redirect
              toast.success("Order placed successfully!");
              navigate("/my-orders");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong during order process");
          }
        },
      };

      // 8️⃣ Open Razorpay window
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p>Total Amount: ₹{totalAmount}</p>
      <button
        onClick={handlePayment}
        className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
