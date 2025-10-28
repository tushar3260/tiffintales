// LoginPage.jsx - Single page with both login methods
import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GoogleLogin } from "@react-oauth/google";
import UserContext from "../context/userContext.jsx";
import { storage } from "../utils/Storage.js";
import { useNavigate } from "react-router-dom";

function LoginPage({ onClose, onSignupClick }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotLink, setShowForgotLink] = useState(false);

  const { setUser, setToken } = useContext(UserContext);

  const closeHandler = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  // Normal Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowForgotLink(false);

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const userData = { email, passwordHash: password };
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        userData
      );
      if (res.status === 200) {
        const { user, token, message } = res.data;
        if (user && token) {
          setUser(user);
          setToken(token);
          storage.setItem("userData", user);
          storage.setItem("usertoken", token);

          setSuccess(message || "Login successful! Redirecting...");
          setLoading(false);

          setTimeout(() => {
            const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
            sessionStorage.removeItem("redirectAfterLogin");

            if (onClose) {
              onClose();
              navigate(redirectPath);
            } else {
              navigate(redirectPath);
            }
          }, 1000);

        } else {
          setError("Invalid response: Missing user or token");
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      const errorMsg = error?.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);

      if (
        errorMsg.toLowerCase().includes("password") ||
        errorMsg.toLowerCase().includes("invalid credentials") ||
        errorMsg.toLowerCase().includes("incorrect")
      ) {
        setShowForgotLink(true);
      } else {
        setShowForgotLink(false);
      }

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // Google Login Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    
    try {
      console.log('Google Login Success - Credential received');
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/google-login`,
        { credential: credentialResponse.credential }
      );

      if (res.status === 200) {
        const { user, token, message } = res.data;
        
        if (user && token) {
          setUser(user);
          setToken(token);
          storage.setItem("userData", user);
          storage.setItem("usertoken", token);

          setSuccess(message || "Google login successful! Redirecting...");

          setTimeout(() => {
            const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
            sessionStorage.removeItem("redirectAfterLogin");

            if (onClose) {
              onClose();
              navigate(redirectPath);
            } else {
              navigate(redirectPath);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      const errorMsg = error?.response?.data?.message || "Google login failed. Please try again.";
      setError(errorMsg);
      
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Error Handler
  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setError("Google login failed. Please try again.");
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={closeHandler}
      ></div>

      {/* Login Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-orange-300 z-10"
      >
        <button
          onClick={closeHandler}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-3xl font-extrabold mb-8 text-orange-600 text-center tracking-wide">
          Login
        </h2>

        {/* Error/Success Messages */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {/* Google Login Section */}
        <div className="mb-6">
          <div className="text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="300"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Email & Password Login Form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
            disabled={loading}
          />

          {showForgotLink && (
            <p className="text-center mb-4">
              <a
                href="/forgot-password?role=user"
                className="text-sm text-orange-500 hover:underline font-medium"
              >
                Forgot Password?
              </a>
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl text-lg shadow-lg transition duration-200 font-semibold focus:outline-none focus:ring-4 focus:ring-orange-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading && <FaSpinner className="animate-spin h-5 w-5 mr-2" />}
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              if (onSignupClick) onSignupClick();
              else navigate("/signup");
            }}
            className="text-orange-500 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
