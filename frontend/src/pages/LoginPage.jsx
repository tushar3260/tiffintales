// LoginPage.jsx — Premium Production Ready
import React, { useState, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { GoogleLogin } from "@react-oauth/google";
import UserContext from "../context/userContext.jsx";
import { storage } from "../utils/Storage.js";
import { useNavigate } from "react-router-dom";

function LoginPage({ onClose, onSignupClick }) {
  const navigate  = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [showForgotLink, setShowForgotLink] = useState(false);

  const { setUser, setToken } = useContext(UserContext);

  const closeHandler = () => {
    if (onClose) onClose();
    else navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setShowForgotLink(false);

    if (!email || !password) { setError("Please fill all fields"); return; }
    if (!email.includes("@")) { setError("Please enter a valid email"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, { email, passwordHash: password });
      if (res.status === 200) {
        const { user, token, message } = res.data;
        if (user && token) {
          setUser(user); setToken(token);
          storage.setItem("userData", user);
          storage.setItem("usertoken", token);
          setSuccess(message || "Login successful! Redirecting...");
          setLoading(false);
          setTimeout(() => {
            const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
            sessionStorage.removeItem("redirectAfterLogin");
            if (onClose) { onClose(); navigate(redirectPath); }
            else navigate(redirectPath);
          }, 900);
        } else {
          setError("Invalid response. Please try again.");
          setLoading(false);
        }
      }
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("incorrect")) {
        setShowForgotLink(true);
      }
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/google-login`, { credential: credentialResponse.credential });
      if (res.status === 200) {
        const { user, token, message } = res.data;
        if (user && token) {
          setUser(user); setToken(token);
          storage.setItem("userData", user);
          storage.setItem("usertoken", token);
          setSuccess(message || "Login successful! Redirecting...");
          setTimeout(() => {
            const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
            sessionStorage.removeItem("redirectAfterLogin");
            if (onClose) { onClose(); navigate(redirectPath); }
            else navigate(redirectPath);
          }, 900);
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Google login failed.";
      setError(msg);
      setTimeout(() => setError(""), 4000);
    } finally { setLoading(false); }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    setTimeout(() => setError(""), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeHandler}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden z-10"
      >
        {/* Orange accent bar */}
        <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500" />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={closeHandler}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <IoClose size={18} />
          </button>

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your Tiffin Tales account</p>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Login */}
          <div className="mb-5 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="280"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="form-label">Email address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">Password</label>
                {showForgotLink && (
                  <a href="/forgot-password?role=user" className="text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg mt-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => { if (onSignupClick) onSignupClick(); else navigate("/signup"); }}
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              Create one
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
