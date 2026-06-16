// ReferAndEarnPage.jsx — Light Theme, No Emojis, Functional
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaGift, FaUserFriends, FaRupeeSign, FaShareAlt, FaCheck } from "react-icons/fa";
import { useUser } from "../../context/userContext.jsx";
import toast from "react-hot-toast";

export default function ReferAndEarn() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  // Generate a referral code from user name
  const referralCode = user?.fullName
    ? (user.fullName.replace(/\s+/g, "").toUpperCase().slice(0, 5) + "123")
    : "TT123";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Tiffin Tales - Home Food App",
        text: `Use my referral code ${referralCode} to get ₹50 off your first order on Tiffin Tales!`,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      copyToClipboard();
    }
  };

  const steps = [
    { icon: <FaUserFriends className="text-2xl text-purple-500" />, title: "Invite Friends", desc: "Share your referral code", bg: "bg-purple-50", border: "border-purple-200" },
    { icon: <FaGift className="text-2xl text-pink-500" />, title: "They Join", desc: "Friends sign up using your code", bg: "bg-pink-50", border: "border-pink-200" },
    { icon: <FaRupeeSign className="text-2xl text-green-500" />, title: "Earn Rewards", desc: "Get ₹50 wallet cash instantly", bg: "bg-green-50", border: "border-green-200" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl shadow-md text-white">
        <h1 className="text-xl sm:text-2xl font-bold">Refer & Earn</h1>
        <p className="text-sm sm:text-base opacity-90 mt-1">
          Invite friends and earn ₹50 for every successful referral!
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div key={i} className={`${step.bg} border ${step.border} p-4 rounded-2xl flex flex-col items-center text-center gap-2`}>
              {step.icon}
              <p className="font-semibold text-gray-800 text-sm">{step.title}</p>
              <p className="text-xs text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-800 mb-3">Your Referral Code</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 border-2 border-dashed border-orange-300 rounded-xl px-4 py-3">
            <span className="font-black text-orange-600 text-xl tracking-widest">{referralCode}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition ${
              copied
                ? "bg-green-500 text-white"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {copied ? <FaCheck /> : <FaCopy />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Referrals</p>
          <p className="text-2xl font-black text-purple-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Earned</p>
          <p className="text-2xl font-black text-green-600">₹0</p>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
      >
        <FaShareAlt /> Invite Friends Now
      </button>
    </motion.div>
  );
}
