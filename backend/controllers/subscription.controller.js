import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Chef from "../models/Chef.js";
import Meal from "../models/Meal.js";

// ✅ Create Subscription
export const createSubscription = async (req, res) => {
  try {
    const {
      userId,
      chefId,
      plan,
      selectedMeals,
      startDate,
      endDate,
      status,
      autoRenew,
      totalAmount
    } = req.body;

    // ✅ Required fields validation
    if (!userId || !chefId || !plan || !startDate) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["userId", "chefId", "plan", "startDate"]
      });
    }

    // ✅ Enum validation
    if (!["Weekly", "Monthly"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan. Allowed: Weekly, Monthly" });
    }

    if (status && !["Active", "Paused", "Cancelled", "Expired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (selectedMeals && !Array.isArray(selectedMeals)) {
      return res.status(400).json({ message: "selectedMeals must be an array" });
    }

    // ✅ Validate user and chef existence
    const user = await User.findById(userId);
    const chef = await Chef.findById(chefId);
    if (!user || !chef) {
      return res.status(404).json({ message: "Invalid userId or chefId" });
    }

    // ✅ Validate each mealId (if selectedMeals provided)
    if (selectedMeals?.length > 0) {
      for (let meal of selectedMeals) {
        const exists = await Meal.findById(meal.mealId);
        if (!exists) {
          return res.status(404).json({ message: `Meal not found: ${meal.mealId}` });
        }
      }
    }

    const subscription = new Subscription({
      userId,
      chefId,
      plan,
      selectedMeals,
      startDate,
      endDate,
      status: status || "Active",
      autoRenew: autoRenew || false,
      totalAmount
    });

    await subscription.save();

    res.status(201).json({
      message: "Subscription created successfully",
      subscription
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to create subscription", error: err.message });
  }
};

// ✅ Get All Subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("userId", "name email")
      .populate("chefId", "name email cuisine")
      .populate("selectedMeals.mealId", "title description price");

    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscriptions", error: err.message });
  }
};

// ✅ Get Subscription by ID
export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate("userId", "name email")
      .populate("chefId", "name email cuisine")
      .populate("selectedMeals.mealId", "title description price");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscription", error: err.message });
  }
};

// ✅ Update Subscription
export const updateSubscription = async (req, res) => {
  try {
    const updates = req.body;

    // ✅ Enum validations
    if (updates.plan && !["Weekly", "Monthly"].includes(updates.plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    if (updates.status && !["Active", "Paused", "Cancelled", "Expired"].includes(updates.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate("userId", "name email")
      .populate("chefId", "name email cuisine")
      .populate("selectedMeals.mealId", "title description price");

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({
      message: "Subscription updated",
      subscription: updatedSubscription
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update subscription", error: err.message });
  }
};

// ✅ Delete Subscription
export const deleteSubscription = async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Failed to delete subscription", error: err.message });
  }
};
