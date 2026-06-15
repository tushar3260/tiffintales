import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
      chefId: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
      title: String,
      price: Number,
      discountedPrice: Number,
      quantity: Number,
      photo: String,
      tags: [String],
    },
  ],
});

export default mongoose.model("Cart", CartItemSchema);
