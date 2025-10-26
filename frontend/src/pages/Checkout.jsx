import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [payment, setPayment] = useState("");

  const handleSelectPayment = (option) => {
    setPayment(option);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-100 p-6">
      <div className="bg-[#fffce5] rounded-xl shadow-xl p-6 max-w-3xl mx-auto relative">
        <h2 className="text-3xl font-bold mb-6 text-orange-700">Checkout</h2>

        {/* Back to cart */}
        <button
          onClick={() => navigate("/cart")}
          className="absolute top-6 right-6 text-orange-700 border border-orange-500 px-4 py-1 rounded-full hover:bg-orange-100 transition"
        >
          ← Back to Cart
        </button>

        {/* Address */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Delivery Address</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
        </div>

        {/* Time Slot */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Select Time Slot</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            <option value="">Select</option>
            <option>8:00 AM - 10:00 AM</option>
            <option>12:00 PM - 2:00 PM</option>
            <option>6:00 PM - 8:00 PM</option>
          </select>
        </div>

        {/* Payment Options */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Payment Option</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Cash On Delivery", "UPI", "Card", "Razorpay"].map((option) => (
              <button
                key={option}
                className={`border p-4 rounded-lg text-center transition ${
                  payment === option
                    ? "bg-orange-100 border-orange-500"
                    : "bg-white"
                }`}
                onClick={() => handleSelectPayment(option)}
              >
                <div className="mb-1">
                  <img
                    src={`/${option
                      .toLowerCase()
                      .replace(/\s/g, "")}.png`} // example: cashondelivery.png
                    alt={option}
                    className="h-6 mx-auto"
                  />
                </div>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Confirmation Message */}
        {payment && (
          <div className="bg-green-100 border border-green-300 p-4 rounded mt-4 text-green-800">
            <p className="font-semibold">You selected {payment}</p>
            <p>Your order will be processed once you confirm it.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
