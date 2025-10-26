import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaGift, FaUserFriends, FaRupeeSign } from "react-icons/fa";

export default function ReferAndEarn() {
  const [referralCode] = useState("VARTUL123");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
     initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="p-4 sm:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-white min-h-screen space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl shadow-md text-white text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Refer & Earn</h1>
        <p className="text-sm sm:text-base opacity-90 mt-1">
          Invite your friends and earn rewards!
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          <div className="flex flex-col items-center gap-2">
            <FaUserFriends className="text-3xl text-purple-500" />
            <p className="font-semibold">Invite Friends</p>
            <p className="text-sm text-gray-500">Share your referral code</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FaGift className="text-3xl text-pink-500" />
            <p className="font-semibold">They Join</p>
            <p className="text-sm text-gray-500">Friends sign up using your code</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FaRupeeSign className="text-3xl text-green-500" />
            <p className="font-semibold">Earn Rewards</p>
            <p className="text-sm text-gray-500">Get wallet cash instantly</p>
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-xl shadow text-white text-center space-y-3"
      >
        <h2 className="text-lg sm:text-xl font-semibold">Your Referral Code</h2>
        <div className="flex justify-center items-center gap-2 bg-white text-blue-700 font-bold px-4 py-2 rounded-lg text-lg">
          {referralCode}
          <button onClick={copyToClipboard} className="ml-2">
            <FaCopy />
          </button>
        </div>
        {copied && <p className="text-green-200 text-sm">Copied to clipboard!</p>}
      </motion.div>

      {/* Invite Button */}
      <div className="text-center">
        <button className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition">
          Invite Now
        </button>
      </div>
    </motion.div>
  );
}
