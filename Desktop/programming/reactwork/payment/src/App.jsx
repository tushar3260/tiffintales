import React, { useState } from "react";

const paymentOptions = ["Cash On Delivery", "UPI", "Card", "Razorpay"];
const upiApps = ["GPay", "PhonePe", "Paytm", "Amazon Pay"];

const PaymentDashboard = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Payment Option</h2>

      {/* Payment Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paymentOptions.map((option) => (
          <div
            key={option}
            className={`border rounded-lg p-4 cursor-pointer text-center transition duration-300 ${
              selectedOption === option ? "bg-blue-100 border-blue-500" : "bg-white"
            }`}
            onClick={() => setSelectedOption(option)}
          >
            <div className="h-16 flex items-center justify-center">
              <img
                src={`/${option.toLowerCase().replace(/ /g, "")}.png`}
                alt={option}
                className="h-10"
              />
            </div>
            <p className="mt-2 font-medium">{option}</p>
          </div>
        ))}
      </div>

      {/* ✅ UPI Section */}
      {selectedOption === "UPI" && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Choose UPI App</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upiApps.map((app) => (
              <div
                key={app}
                className="border rounded-lg p-4 bg-white hover:bg-gray-100 text-center"
              >
                <img
                  src={`/${app.toLowerCase().replace(/ /g, "")}.png`}
                  alt={app}
                  className="h-10 mx-auto"
                />
                <p className="mt-2">{app}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Card Form */}
      {selectedOption === "Card" && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-medium mb-4">Enter Card Details</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name on Card</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  placeholder="07/25"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Pay Now
            </button>
          </form>
        </div>
      )}

      {/* ✅ Cash On Delivery Message */}
      {selectedOption === "Cash On Delivery" && (
        <div className="mt-6 bg-green-100 p-4 rounded-lg max-w-md">
          <h3 className="text-lg font-medium text-green-800">
            You selected Cash On Delivery
          </h3>
          <p className="text-green-700 mt-2">
            Your order will be placed and paid at delivery time.
          </p>
        </div>
      )}

      {/* ✅ Razorpay Section */}
      {selectedOption === "Razorpay" && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-medium mb-4">Razorpay Payment</h3>
          <p className="text-gray-700 mb-4">
            Click the button below to proceed with Razorpay payment gateway.
          </p>
          <button
            onClick={() => alert("Redirecting to Razorpay...")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Pay with Razorpay
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;
