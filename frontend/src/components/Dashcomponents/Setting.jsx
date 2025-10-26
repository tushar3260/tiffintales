import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaBell, FaMoon, FaSun, FaLock, FaTrash } from "react-icons/fa";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-white min-h-screen space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-5 sm:p-6 rounded-xl shadow-md text-white text-center sm:text-left">
  <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
  <p className="text-sm sm:text-base opacity-90 mt-1">
    Manage your account and preferences
  </p>
</div>


      {/* Profile Settings */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-5 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <FaUser className="text-blue-500" /> Profile Information
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-5 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <FaBell className="text-yellow-500" /> Preferences
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-700">Enable Notifications</p>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full ${notifications ? "bg-green-500" : "bg-gray-400"} relative`}
          >
            <span
              className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition ${
                notifications ? "right-0.5" : "left-0.5"
              }`}
            ></span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-700">Dark Mode</p>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            {darkMode ? <FaMoon /> : <FaSun />} {darkMode ? "On" : "Off"}
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-5 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <FaLock className="text-red-500" /> Security
        </h2>
        <div className="space-y-3">
          <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition">
            Change Password
          </button>
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition flex items-center gap-2">
            <FaTrash /> Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
