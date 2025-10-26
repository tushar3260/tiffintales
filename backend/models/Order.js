import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: "Chef", required: true },
  meals: [
    {
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
      quantity: { type: Number, default: 1 },
      price: { type: Number }
    }
  ],
  totalPrice: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    pincode: String
  },
  timeSlot: { type: String, enum: ["Lunch", "Dinner"] },
  status: {
    type: String,
    enum: ["Placed", "Preparing", "Delivered", "Cancelled"],
    default: "Placed"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  paymentMode: { type: String },
  createdAt: { type: Date, default: Date.now }
},
{
  timestamps: true  
});

export default mongoose.model("Order", orderSchema);