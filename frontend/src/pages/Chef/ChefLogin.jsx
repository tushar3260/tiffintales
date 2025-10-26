import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import ChefContext from './Context/ChefContext.jsx';
import Loading from '../../Loading.jsx';
import { storage } from '../../utils/Storage.js';

const ChefLogin = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotLink, setShowForgotLink] = useState(false);

  const { setChef, setChefToken } = useContext(ChefContext);
  const navigate = useNavigate();

  const shouldShowForgot = (msg = '') => {
    const m = msg.toLowerCase();
    return (
      m.includes('password') ||
      m.includes('invalid credentials') ||
      m.includes('incorrect') ||
      m.includes('unauthorized')
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setShowForgotLink(false);

    if (!email || !passwordHash) {
      const msg = '❌ Email and Password required';
      toast.error(msg);
      setError(msg);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chefs/login`,
        { email: email.trim(), passwordHash },
        { withCredentials: true }
      );

      const token = res.data.token;
      const chef = res.data.chef;

      if (!token) {
        const msg = '❌ Login failed! No token received';
        toast.error(msg);
        setError(msg);
        setShowForgotLink(true);
        return;
      }

      storage.setItem('chefToken', token);
      storage.setItem('chefData', chef);
      storage.setItem('chefEmail', chef.email);

      setChef(chef);
      setChefToken(token);

      toast.success(res.data.message || '✅ Chef logged in successfully!');
      setLoading(false);
      navigate('/chef/chefdashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || '❌ Login failed!';
      toast.error(msg);
      setError(msg);
      setShowForgotLink(shouldShowForgot(msg));
    } finally {
      setLoading(false);
    }
  };

  // Default close behavior (when directly from route)
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/chef'); // Back to landing page
    }
  };

  const handleSignup = () => {
    if (onSignupClick) {
      onSignupClick();
    } else {
      navigate('/chef/signup'); // Go to signup route
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Toaster position="top-center" />
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {loading && <Loading message="Logging in as Chef..." />}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-orange-300 z-10"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-[#ff7e00] text-center">
          Chef Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={passwordHash}
            disabled={loading}
            onChange={(e) => setPasswordHash(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300"
          />

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          {showForgotLink && (
            <p className="text-center text-sm">
              <button
                onClick={() =>
                  (window.location.href = '/forgot-password?role=chef')
                }
                className="text-[#ff7e00] underline font-medium"
                type="button"
              >
                Forgot Password?
              </button>
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-[#ff7e00] hover:bg-orange-600 text-white rounded-xl shadow-lg"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Chef'}
          </motion.button>
        </form>

        <p className="mt-4 text-center">
          Don&apos;t have an account?{' '}
          <button
            onClick={handleSignup}
            className="text-[#ff7e00] underline font-medium"
          >
            Sign up here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ChefLogin;
