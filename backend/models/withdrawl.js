import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
},
{
  timestamps: true 


});

export default mongoose.model("Withdrawal", withdrawalSchema);