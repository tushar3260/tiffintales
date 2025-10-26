import React from "react";
import { FaFire, FaCrown, FaLeaf } from "react-icons/fa";

const plans = [
  {
    title: "Basic Tiffin",
    price: "₹799/mo",
    icon: <FaLeaf size={28} className="text-green-500" />,
    features: [
      "1 Meal / Day",
      "Home-style Food",
      "Monthly Plan",
      "Free Delivery",
    ],
    bg: "bg-green-50",
    popular: false,
  },
  {
    title: "Pro Tiffin",
    price: "₹1299/mo",
    icon: <FaFire size={28} className="text-orange-500" />,
    features: [
      "2 Meals / Day",
      "Custom Menu Options",
      "Monthly Plan",
      "Priority Support",
      "Free Delivery",
    ],
    bg: "bg-orange-50",
    popular: true,
  },
  {
    title: "Elite Tiffin",
    price: "₹1999/mo",
    icon: <FaCrown size={28} className="text-yellow-500" />,
    features: [
      "3 Meals / Day",
      "Chef-Special Recipes",
      "Weekly Menu Rotation",
      "VIP Delivery",
      "Dedicated Support",
    ],
    bg: "bg-yellow-50",
    popular: false,
  },
];

const SubscriptionPlans = () => {
  return (
    <div className="py-16 px-4 sm:px-8 lg:px-20 bg-white">
      <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-12">
        Choose Your Tiffin Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative rounded-3xl shadow-xl p-8 ${plan.bg} border-2 ${
              plan.popular ? "border-orange-400 scale-105" : "border-transparent"
            } transition-transform hover:scale-105`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-xl text-xs font-bold">
                Most Popular
              </div>
            )}
            <div className="mb-4 flex justify-center">{plan.icon}</div>
            <h3 className="text-2xl font-bold text-center mb-2 text-orange-700">
              {plan.title}
            </h3>
            <p className="text-center text-2xl font-extrabold text-gray-800 mb-6">
              {plan.price}
            </p>
            <ul className="mb-6 space-y-2 text-gray-700 text-sm">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  ✅ {feat}
                </li>
              ))}
            </ul>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold shadow-md transition">
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
