// models/User.js - आपके existing model में ये fields add करें
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  avtar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/11018/11018596.png"
  },
  phone: {
    type: String,
    required: function() { return this.provider === 'local'; }, // Only required for local accounts
    match: /^[6-9]\d{9}$/
  },
  role: { type: String, enum: ['user'], default: 'user' },
  passwordHash: { 
    type: String, 
    required: function() { return this.provider === 'local'; } // Only required for local accounts
  },
  
  // ✅ Google OAuth Fields - Add these
  googleId: { type: String, unique: true, sparse: true },
  provider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  
  address: [
    {
      street: String,
      city: String,
      pincode: String,
      tag: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chef" }],
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  isOtpVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
