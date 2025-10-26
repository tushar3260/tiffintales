import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = "USER_ID"; // Replace with context user._id
        const res = await axios.get(
          `http://localhost:5000/api/subscription/${userId}`
        );
        setSubscription(res.data);
      } catch (err) {
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading subscription details...</p>;

  if (!subscription)
    return (
      <div className="p-4 sm:p-6 text-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-xl sm:text-2xl font-bold">No Active Subscription</h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          You don’t have any active subscription. Buy a plan to enjoy meals!
        </p>
        <button className="mt-4 w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
          Browse Plans
        </button>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">My Subscription</h1>

      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md space-y-3">
        <h2 className="text-lg sm:text-xl font-semibold">{subscription.planName}</h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Status:{" "}
          <span
            className={`font-bold ${
              subscription.active ? "text-green-600" : "text-red-500"
            }`}
          >
            {subscription.active ? "Active" : "Expired"}
          </span>
        </p>

        <div className="space-y-1 text-sm sm:text-base">
          <p><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
          <p><strong>Meals Left:</strong> {subscription.mealsLeft} / {subscription.totalMeals}</p>
          <p><strong>Next Billing:</strong> {new Date(subscription.nextBilling).toLocaleDateString()}</p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <button className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
            Renew Plan
          </button>
          <button className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}
