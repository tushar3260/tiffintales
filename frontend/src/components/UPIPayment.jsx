// components/UPIPayment.jsx
import { useState } from "react";

const UPIPayment = () => {
  const [upiId, setUpiId] = useState("");

  const handlePayment = async () => {
    const res = await fetch("http://localhost:5000/api/payment/upi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        upiId: upiId,
        amount: 299, // 👈 total bill
      }),
    });

    const data = await res.json();

    if (data && data.id) {
      const options = {
        key: "YOUR_KEY_ID",
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        method: "upi",
        upi: {
          vpa: upiId,
        },
        handler: function (response) {
          alert("Payment successful!");
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Enter UPI ID (e.g. tushar@paytm)"
        className="p-2 border rounded"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded"
        onClick={handlePayment}
      >
        Pay via Paytm UPI
      </button>
    </div>
  );
};

export default UPIPayment;
