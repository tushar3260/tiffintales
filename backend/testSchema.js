// testSchema.js

import mongoose from "mongoose";
import Chef from "./models/Chef.js";
import Meal from "./models/Meal.js";
import Order from "./models/Order.js";
import Subscription from "./models/Subscription.js";
import Review from "./models/review.js";
import Admin from "./models/admin.js";
import User from "./models/User.js";
import Withdrawal from "./models/withdrawl.js";

const MONGO_URI = "mongodb://localhost:27017/sampletest";

async function runTest() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅Connected to MongoDB");
    await mongoose.connection.db.dropDatabase();

    // Create Admin
    const admin = await Admin.create({
      username: "superadmin",
      passwordHash: "supersecurehash",
      role: "superadmin",
    });

    // Create User
    const user = await User.create({
      name: "Amit Sharma",
      email: "amit@example.com",
      phone: "9876543210",
      passwordHash: "hashed123",
      address: {
        street: "MG Road",
        city: "Delhi",
        pincode: "110001",
      },
    });

    // Create Chef
    const chef = await Chef.create({
      name: "Chef Raj",
      email: "raj@example.com",
      phone: "9876543211",
      passwordHash: "securepass",
      cuisine: ["North Indian", "South Indian"],
      isVerified: true,
      location: {
        area: "Connaught Place",
        lat: 28.6,
        lng: 77.2,
      },
    });

    // Create Meal
    const meal = await Meal.create({
      chefId: chef._id,
      title: "Deluxe Thali",
      description: "Includes 2 sabzi, roti, rice, salad",
      tags: ["Veg", "Dinner"],
      availableDays: ["Monday", "Friday"],
      timeSlots: ["Lunch", "Dinner"],
      price: 199,
    });

    // Create Order
    const order = await Order.create({
      userId: user._id,
      chefId: chef._id,
      meals: [
        {
          mealId: meal._id,
          quantity: 2,
          price: 199,
        },
      ],
      totalPrice: 398,
      deliveryAddress: {
        street: "MG Road",
        city: "Delhi",
        pincode: "110001",
      },
      timeSlot: "Lunch",
      status: "Placed",
      paymentStatus: "Paid",
      paymentMode: "UPI",
    });

    // Create Subscription
    const subscription = await Subscription.create({
      userId: user._id,
      chefId: chef._id,
      plan: "Weekly",
      selectedMeals: [
        {
          day: "Monday",
          time: "Lunch",
          mealId: meal._id,
        },
      ],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalAmount: 1393,
    });

    // Create Review
    const review = await Review.create({
      userId: user._id,
      chefId: chef._id,
      orderId: order._id,
      rating: 5,
      comment: "Amazing food and delivery!",
    });

    // Create Withdrawal Request
    const withdrawal = await Withdrawal.create({
      chefId: chef._id,
      amount: 1000,
    });

    console.log("\nSample data inserted successfully:");
    console.log({ admin, user, chef, meal, order, subscription, review, withdrawal });

    await mongoose.disconnect();
    console.log("\n Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

runTest();
