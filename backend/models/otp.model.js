// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  role: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  // createdAt is used by resendOTP to enforce a 1-minute cooldown
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Otp", otpSchema);
