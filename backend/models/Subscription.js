import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
  plan: { type: String, enum: ["Weekly", "Monthly"], required: true },
  selectedMeals: [
    {
      day: { type: String },
      time: { type: String, enum: ["Lunch", "Dinner"] },
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" }
    }
  ],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["Active", "Paused", "Cancelled", "Expired"],
    default: "Active"
  },
  autoRenew: { type: Boolean, default: false },
  totalAmount: { type: Number }
},
{
  timestamps: true  
});

export default mongoose.model("Subscription", subscriptionSchema);