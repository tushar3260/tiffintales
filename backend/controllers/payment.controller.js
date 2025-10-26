// backend/controllers/paymentController.js
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET",
});

export const createUpiPayment = async (req, res) => {
  const { amount, upiId } = req.body;

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    method: "upi",
    upi: {
      vpa: upiId,
    },
    description: "Payment for Mom's Kitchen Order",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
