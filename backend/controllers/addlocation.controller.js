import User from "../models/User.js";
export const addUserAddress = async (req, res) => {
  const { id } = req.params;
  const { street, city, pincode, tag } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.address.push({ street, city, pincode, tag });
    await user.save();

    res.status(200).json({ message: "Address added", address: user.address });
  } catch (err) {
    res.status(500).json({ message: "Failed to add address", error: err.message });
  }
};


// controller
export const getUserAddresses = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("address");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.address);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch addresses", error: err.message });
  }
};

