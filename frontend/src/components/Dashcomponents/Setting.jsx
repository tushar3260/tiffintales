// Setting.jsx — Light Theme, No Emojis, Functional toggles
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaBell, FaLock, FaTrash, FaShieldAlt } from "react-icons/fa";
import { HiOutlineCog } from "react-icons/hi";
import { useUser } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Settings() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success("Profile info updated!");
  };

  const handleChangePassword = () => {
    navigate("/forgot-password");
  };

  const ToggleSwitch = ({ value, onChange, label }) => (
    <div className="flex items-center justify-between py-2">
      <p className="text-sm text-gray-700 font-medium">{label}</p>
      <button
        onClick={() => { onChange(!value); toast.success(`${label} ${!value ? "enabled" : "disabled"}`); }}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-orange-500" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${value ? "right-0.5" : "left-0.5"}`} />
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-5 sm:p-6 rounded-2xl shadow-md text-white">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <HiOutlineCog className="text-2xl" /> Settings
        </h1>
        <p className="text-sm sm:text-base opacity-90 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <motion.div whileHover={{ scale: 1.005 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800">
          <FaUser className="text-blue-500" /> Profile Information
        </h2>
        <form className="space-y-3" onSubmit={handleSaveProfile}>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none text-sm transition"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow hover:shadow-md transition text-sm"
          >
            Save Changes
          </button>
        </form>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div whileHover={{ scale: 1.005 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800">
          <FaBell className="text-yellow-500" /> Notification Preferences
        </h2>
        <div className="divide-y divide-gray-100">
          <ToggleSwitch value={notifications} onChange={setNotifications} label="Push Notifications" />
          <ToggleSwitch value={emailUpdates} onChange={setEmailUpdates} label="Email Updates" />
          <ToggleSwitch value={orderAlerts} onChange={setOrderAlerts} label="Order Status Alerts" />
        </div>
      </motion.div>

      {/* Security */}
      <motion.div whileHover={{ scale: 1.005 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800">
          <FaShieldAlt className="text-green-500" /> Security
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleChangePassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 border border-orange-200 font-semibold rounded-xl hover:bg-orange-100 transition text-sm"
          >
            <FaLock /> Change Password
          </button>
          <button
            onClick={() => toast.error("Contact support to delete account")}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 font-semibold rounded-xl hover:bg-red-100 transition text-sm"
          >
            <FaTrash /> Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
