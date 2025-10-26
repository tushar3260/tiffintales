import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";
import { storage } from "../utils/Storage.js";
const Threedot = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleOptionClick = (label) => {
    setIsMenuOpen(false);
    if (label === "Profile") navigate("/dashboard");
    else if (label === "Orders") navigate("/orders");
  };

  const handleChefClick = () => {
    setIsMenuOpen(false);
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/chef/";
    }, 600); // spinner delay
  };

  const handleLogout = () => {
    storage.removeItem("userData");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <button
        onClick={() => setIsMenuOpen(true)}
        className="text-gray-600 hover:text-black p-2"
        title="More Options"
      >
        <FaEllipsisV size={18} />
      </button>

      {/* Full screen loader */}
      {loading && (
        <div className="fixed inset-0 bg-[#fff8ee]/60 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-dashed border-[#ff7e00] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-solid border-white rounded-full"></div>
          </div>
          <p className="mt-4 text-[#ff7e00] font-semibold animate-pulse text-lg">
            Redirecting to Chef...
          </p>
        </div>
      )}

      {isMenuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 text-2xl"
            >
              .
            </button>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => handleOptionClick("Profile")}
              className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Profile
            </button>
            <button
              onClick={() => handleOptionClick("Orders")}
              className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Orders
            </button>
            <button
              onClick={handleChefClick}
              className="w-full px-4 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
            >
              🍳 Become a Chef
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Threedot;
