import React, { useState } from "react";

const paymentOptions = [
  {
    name: "Cash On Delivery",
    icon: "data:image/png;base64,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" // You can add local paths to icons here if desired, e.g., '/cod.png'
  },
  {
    name: "UPI",
    icon: "data:image/png;base64,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" // e.g., '/upi.png'
  },
  {
    name: "Card",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr9emH1hlOeyT5kkrc5GOL1eC-LiLlZwZTOg&s" // e.g., '/card.png'
  },
  {
    name: "Razorpay",
    icon: "data:image/png;base64,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" // e.g., '/razorpay.png'
  }
];

const upiApps = [
  { name: "GPay", icon: "data:image/png;base64,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"

   },
  { name: "PhonePe", icon: "data:image/png;base64,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" },
  { name: "Paytm", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRjVt_MV4w_OR6n6Nks5pJVL5EtOYgt_76Mg&s" },
  { name: "Amazon Pay", icon: "data:image/png;base64,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" }
 // Added Razorpay as a UPI option
];



const CartCheckoutPage = () => {
  const [step, setStep] = useState("cart");
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Tandoori Paneer Pizza",
      price: 250,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1672856399643-47ddf6b2d6d6?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "Chole Bhature",
      price: 120,
      quantity: 2,
      image:
        "https://media.istockphoto.com/id/979914742/photo/chole-bhature-or-chick-pea-curry-and-fried-puri-served-in-terracotta-crockery-over-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=8pmBVIcNb-GIFnsBT0sYqfy-YtzNq7pOqc6lQZgFOPo="
    }
  ]);

  const [address, setAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery"); // Default to Cash On Delivery
  const [selectedUpiApp, setSelectedUpiApp] = useState(""); // State for selected UPI app

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }
    if (!address || !timeSlot) { // Check for address and time slot
      alert("Please fill in your delivery address and select a time slot.");
      return;
    }

    let paymentDetails = `💳 Payment: ${paymentMethod}`;
    if (paymentMethod === "UPI") {
      if (!selectedUpiApp) {
        alert("Please select a UPI app.");
        return;
      }
      paymentDetails += ` (${selectedUpiApp})`;
    } else if (paymentMethod === "Card") {
      // Add validation for card details here if needed
      // For now, it will just proceed
    } else if (paymentMethod === "Razorpay") {
        // Razorpay is a payment gateway, no sub-selection needed for this top-level option
    }

    alert(
      `✅ Order Placed Successfully!\n\n📍 Address: ${address}\n⏰ Time Slot: ${timeSlot}\n${paymentDetails}\n💰 Total: ₹${total}`
    );
    // In a real application, you'd send the order data to your backend here
    // For demonstration, we'll reset the state
    setCartItems([]);
    setAddress("");
    setTimeSlot("");
    setPaymentMethod("Cash On Delivery"); // Reset to default
    setSelectedUpiApp(""); // Reset selected UPI app
    setStep("cart"); // Go back to cart or a confirmation page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 to-yellow-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Steps */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setStep("cart")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              step === "cart"
                ? "bg-orange-600 text-white"
                : "bg-orange-100 text-gray-800"
            }`}
          >
            🛒 Cart
          </button>
          <button
            onClick={() => setStep("checkout")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              step === "checkout"
                ? "bg-orange-600 text-white"
                : "bg-orange-100 text-gray-800"
            }`}
          >
            📦 Checkout
          </button>
        </div>

        {/* Cart Page */}
        {step === "cart" && (
          <div className="bg-yellow-50 rounded-xl shadow-lg p-6 flex flex-col lg:flex-row gap-6">
            <div className="hidden lg:flex justify-center items-center">
              <img
                src="https://ps.w.org/mini-ajax-woo-cart/assets/icon-256x256.gif?rev=2672132"
                alt="Cart Icon"
                className="w-32 h-32"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-orange-700">
                Your Cart
              </h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty 😕</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between mb-4 border-b pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-gray-500">
                          ₹{item.price} x {item.quantity}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="bg-gray-200 px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="bg-gray-200 px-2 py-1 rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="ml-4 text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="text-right mt-6 text-xl font-bold text-orange-700">
                Total: ₹{total}
              </div>
              {cartItems.length > 0 && (
                <div className="text-right">
                  <button
                    onClick={() => setStep("checkout")}
                    className="mt-6 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700"
                  >
                    Proceed to Checkout →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checkout Page */}
        {step === "checkout" && (
          <form
            onSubmit={handleCheckout}
            className="bg-yellow-50 rounded-xl shadow-lg p-6 relative"
          >
            <h2 className="text-3xl font-bold mb-6 text-orange-700">Checkout</h2>

            <div className="mb-4">
              <label htmlFor="address" className="block font-semibold mb-1">Delivery Address</label>
              <textarea
                id="address"
                className="w-full border p-3 rounded-lg"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="timeSlot" className="block font-semibold mb-1">Select Time Slot</label>
              <select
                id="timeSlot"
                className="w-full border p-3 rounded-lg"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="10am - 12pm">10am - 12pm</option>
                <option value="12pm - 2pm">12pm - 2pm</option>
                <option value="6pm - 8pm">6pm - 8pm</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Payment Option</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentOptions.map((option) => (
                  <label
                    key={option.name}
                    className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer ${
                      paymentMethod === option.name
                        ? "border-orange-500 bg-orange-100"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.name}
                      checked={paymentMethod === option.name}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        if (e.target.value !== "UPI") { // Clear UPI app selection if not UPI
                          setSelectedUpiApp("");
                        }
                      }}
                      className="hidden"
                    />
                    {option.icon ? (
                      <img
                        src={option.icon}
                        alt={option.name}
                        className="w-10 h-10 mb-2 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 mb-2 flex items-center justify-center text-xl">
                        {/* Placeholder for icons if paths aren't provided */}
                        {option.name === "Cash On Delivery" && "💵"}
                        {option.name === "UPI" && "🌐"}
                        {option.name === "Card" && "💳"}
                        {option.name === "Razorpay" && "⚡"}
                      </div>
                    )}
                    <span className="text-sm font-medium text-center">{option.name}</span>
                  </label>
                ))}
              </div>

              {/* Conditional rendering for payment details */}
              {paymentMethod === "UPI" && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Choose UPI App</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {upiApps.map((app) => (
                      <div
                        key={app.name}
                        className={`border rounded-lg p-4 cursor-pointer bg-white hover:bg-gray-100 text-center ${
                          selectedUpiApp === app.name ? "border-blue-500 ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedUpiApp(app.name)}
                      >
                        <img
                          src={app.icon}
                          alt={app.name}
                          className="h-10 mx-auto"
                        />
                        <p className="mt-2">{app.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === "Card" && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-md">
                  <h3 className="text-lg font-medium mb-4">Enter Card Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        placeholder="John Doe"
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label htmlFor="expiry" className="block text-sm font-medium mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          id="expiry"
                          placeholder="07/25"
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                        <input
                          type="password"
                          id="cvv"
                          placeholder="123"
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "Cash On Delivery" && (
                <div className="mt-6 bg-green-100 p-4 rounded-lg max-w-md">
                  <h3 className="text-lg font-medium text-green-800">
                    You selected Cash On Delivery
                  </h3>
                  <p className="text-green-700 mt-2">
                    Your order will be placed and paid at delivery time.
                  </p>
                </div>
              )}

              {paymentMethod === "Razorpay" && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-md">
                  <h3 className="text-lg font-medium mb-4">Razorpay Payment Gateway</h3>
                  <p className="text-gray-700 mb-4">
                    Click the button below to proceed with the Razorpay payment gateway for various options including cards, net banking, and UPI.
                  </p>
                  <button
                    type="button"
                    onClick={() => alert("Redirecting to Razorpay payment gateway...")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Proceed to Razorpay
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep("cart")}
              className="absolute top-4 right-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-400 px-4 py-1 rounded-full text-sm"
            >
              ← Back to Cart
            </button>

            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 float-right"
            >
              Place Order ✅
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CartCheckoutPage;