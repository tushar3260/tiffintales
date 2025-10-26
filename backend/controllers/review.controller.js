import Review from "../models/review.js";
import User from "../models/User.js";
import Chef from "../models/Chef.js";
import Order from "../models/Order.js";

// ✅ Create Review
export const createReview = async (req, res) => {
  try {
    const { userId, chefId, orderId, rating, comment } = req.body;

    // ✅ Validate required fields
    if (!userId || !chefId || !orderId || rating === undefined) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["userId", "chefId", "orderId", "rating"]
      });
    }

    // ✅ Check foreign keys
    const user = await User.findById(userId);
    const chef = await Chef.findById(chefId);
    const order = await Order.findById(orderId);

    if (!user || !chef || !order) {
      return res.status(404).json({
        message: "Invalid userId, chefId, or orderId"
      });
    }

    const review = new Review({ userId, chefId, orderId, rating, comment });

    await review.save();
    res.status(201).json({
      message: "Review created successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

// ✅ Get All Reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name")
      .populate("chefId", "name")
      .populate("orderId");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// ✅ Get Reviews for a Specific Chef
export const getReviewsByChef = async (req, res) => {
  try {
    const reviews = await Review.find({ chefId: req.params.chefId })
      .populate("userId", "name")
      .populate("orderId");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chef reviews", error: error.message });
  }
};

// ✅ Delete a Review
export const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};

