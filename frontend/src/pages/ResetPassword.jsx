import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();

  const token = window.location.pathname.split("/").pop();
  const role = new URLSearchParams(search).get("role");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/forgot/reset-password`, {
        token,
        role,
        newPassword,
      });

      toast.success(res.data.message || 'Password reset successful!');

      // ✅ Redirect after 2.5s
      setTimeout(() => {
        if (role === "admin") navigate("/admin/secure/tales/login");
        else if (role === "chef") navigate("/chef/login");
        else navigate("/login");
      }, 2500);

    } catch (err) {
      console.error('Reset error:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Reset failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-orange-200"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-orange-600">
          Reset Your Password
        </h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            className="w-full p-3 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-md"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
