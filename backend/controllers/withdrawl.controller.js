import Withdrawal from "../models/withdrawl.js";

// ✅ Create a withdrawal request
export const requestWithdrawal = async (req, res) => {
  try {
    const { chefId, amount } = req.body;

    const withdrawal = new Withdrawal({
      chefId,
      amount
    });

    await withdrawal.save();
    res.status(201).json({ message: "Withdrawal request submitted", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Error submitting withdrawal request", error: error.message });
  }
};

// ✅ Get all withdrawals (admin use)
export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().populate("chefId", "username email");
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching withdrawals", error: error.message });
  }
};

// ✅ Get withdrawals by Chef ID (user-specific)
export const getWithdrawalsByChef = async (req, res) => {
  try {
    const { chefId } = req.params;
    const withdrawals = await Withdrawal.find({ chefId });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chef's withdrawals", error: error.message });
  }
};

// ✅ Update withdrawal status (approve/reject)
export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const withdrawal = await Withdrawal.findByIdAndUpdate(
      id,
      {
        status,
        processedAt: Date.now(),
      },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    res.status(200).json({ message: "Withdrawal status updated", withdrawal });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};
