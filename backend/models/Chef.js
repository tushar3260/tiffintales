import mongoose from "mongoose";

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"]
  },
  role: { type: String, enum: ['chef'], default: 'chef' },
  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"]
  },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: "" },
  cuisine: { type: [String], required: true },
  kitchenImages: { type: [String], required: true },
  documents: {
    aadhaar: { type: String, required: true },
    pan: { type: String, required: true }
  },
  bankDetails: {
    accNo: { type: String, required: true },
    ifsc: { type: String, required: true },
    holderName: { type: String, required: true }
  },
  location: {
    area: { type: String, required: true },
    lat: { type: String, required: true },
    lng: { type: String, required: true }
  },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
,isOtpVerified: { type: Boolean, default: false }

});

export default mongoose.model("Chef", chefSchema);
