import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  isOtpVerified: { type: Boolean, default: false },

}, {
  timestamps: true  
});

export default mongoose.model("Admin", adminSchema);
