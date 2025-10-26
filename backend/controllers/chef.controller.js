import Chef from "../models/Chef.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// ✅ New Public Controller to Get Verified Chefs Only
export const getPublicVerifiedChefs = async (req, res) => {
  try {
    const chefs = await Chef.find({ isVerified: true }).select("-passwordHash");
    res.status(200).json(chefs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch verified chefs", error: err.message });
  }
};


export const registerChef = async (req, res) => {
  const { name, email, phone, passwordHash, bio, cuisine, kitchenImages, documents, bankDetails, location } = req.body;
  const existingChef = await Chef.findOne({ email });
  if (existingChef) return res.status(400).json({ message: "Chef already exists" });

  const hashedPassword = await bcrypt.hash(passwordHash, 10);
  const chef = new Chef({
    name, email, phone,
    passwordHash: hashedPassword,
    bio, cuisine, kitchenImages,
    documents, bankDetails, location
  });
  await chef.save();

  const token = jwt.sign({ id: chef._id, role: chef.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({ message: "Chef registered", chef, token });
};

export const loginChef = async (req, res) => {
  const { email, passwordHash } = req.body;
  const chef = await Chef.findOne({ email });
  if (!chef) return res.status(404).json({ message: "Chef not found" });

  const isMatch = await bcrypt.compare(passwordHash, chef.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  // ✅ BLOCK login if not verified
  if (!chef.isVerified) {
    return res.status(403).json({ message: "Your account is not approved by admin yet." });
  }

  const token = jwt.sign({ id: chef._id, role: chef.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ message: "Login successful", chef, token });
};


export const getAllChefs = async (req, res) => {
  try {
    const chefs = await Chef.find().select("-passwordHash");
    res.status(200).json(chefs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chefs", error: err.message });
  }
};

export const getChefById = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).select("-passwordHash");
    if (!chef) return res.status(404).json({ message: "Chef not found" });
    res.status(200).json(chef);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chef", error: err.message });
  }
};

export const deleteChef = async (req, res) => {
  try {
    const chef = await Chef.findByIdAndDelete(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });
    res.status(200).json({ message: "Chef deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting chef", error: err.message });
  }
};

export const toggleApproval = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    chef.isVerified = req.body.isVerified;
    await chef.save();

    res.status(200).json({ message: "Approval status updated", chef });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle approval", error: err.message });
  }
};
