import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
      title: String,
      price: Number,
      quantity: Number,
      photo: String,
    },
  ],
});

export default mongoose.model("Cart", CartItemSchema);
