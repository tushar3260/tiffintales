import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import UserContext from "../context/userContext.jsx";
import { storage } from "../utils/Storage.js";

const OTP_LENGTH = 6;
const OTP_RESEND_COOLDOWN = 60; // seconds

function SignupPage({ onClose, onLoginClick }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [validations, setValidations] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  });

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // OTP resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimerRef = useRef(null);

  // Reset OTP states & cooldown timer on email change
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setResendCooldown(0);
  }, [email]);

  // Handle OTP resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownTimerRef.current = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      clearTimeout(cooldownTimerRef.current);
    }
    return () => clearTimeout(cooldownTimerRef.current);
  }, [resendCooldown]);

  const closeHandler = () => {
    if (onClose) onClose();
    else navigate("/");
  };

  // Email validation regex
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password strength check
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 6) return "Weak";
    if (
      pwd.length >= 8 &&
      pwd.match(/[A-Z]/) &&
      pwd.match(/[0-9]/) &&
      pwd.match(/[^A-Za-z0-9]/)
    )
      return "Strong";
    return "Medium";
  };

  // Real-time validation
  const updateValidations = () => {
    setValidations({
      name: name.trim().length >= 2,
      email: validateEmail(email),
      password: password.length >= 6,
      confirmPassword: confirmPassword.length >= 6 && password === confirmPassword,
      phone: /^\d{10}$/.test(phone),
    });
  };

  // Update validations whenever form fields change
  useEffect(() => {
    updateValidations();
  }, [name, email, password, confirmPassword, phone]);

  // Check if all basic details are valid
  const allDetailsValid = Object.values(validations).every(Boolean);

  // Send OTP handler
  const handleSendOtp = async () => {
    setSuccess("");

    if (!allDetailsValid) {
      toast.error("Please complete all required fields correctly");
      return;
    }

    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown}s before resending OTP.`);
      return;
    }

    setOtpLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/otp/send-otp`,
        { email, role: "user" }
      );

      if (response.status === 200) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtp("");
        toast.success("OTP sent successfully! Check your email.");
        setResendCooldown(OTP_RESEND_COOLDOWN);
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      if (error?.response?.status === 409) {
        toast.error("Email is already registered. Please login or use another email.");
        setOtpSent(false);
        setOtpVerified(false);
        setOtp("");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to send OTP. Please try again."
        );
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    setSuccess("");

    if (otp.length !== OTP_LENGTH) {
      toast.error(`Please enter a valid ${OTP_LENGTH}-digit OTP`);
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/otp/verify-otp`,
        { email, role: "user", otp }
      );

      if (response.status === 200) {
        setOtpVerified(true);
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error(
        error?.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!allDetailsValid) {
      toast.error("Please complete all required fields correctly");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify your email with OTP before signing up");
      return;
    }

    const userData = {
      fullName: name.trim(),
      email,
      passwordHash: password,
      phone,
    };

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        userData
      );

      if (res.status === 201) {
        const { user } = res.data;
        if (user) {
          setUser(user);
          await storage.setItem(
            "userData",
            JSON.stringify({
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
              role: user.role,
            })
          );

          setSuccess("Signup successful! Redirecting...");
          toast.success("Account created successfully!");
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          toast.error("Signup failed: Missing user data");
        }
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Validation icon component
  const ValidationIcon = ({ isValid, show }) => {
    if (!show) return null;
    return isValid ? (
      <FaCheck className="text-green-500 text-sm" />
    ) : (
      <FaTimes className="text-red-500 text-sm" />
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={closeHandler}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 border-yellow-300 z-10 max-h-[85vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={closeHandler}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors duration-200 hover:bg-red-50 rounded-full p-1"
          aria-label="Close signup modal"
        >
          <IoClose size={24} />
        </button>

        <h2
          id="signup-title"
          className="text-3xl font-extrabold mb-8 text-yellow-600 text-center tracking-wide"
        >
          Create Account
        </h2>

        <form onSubmit={handleSignup} noValidate>
          {/* Full Name */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 pr-10 border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                name
                  ? validations.name
                    ? "border-green-400 focus:ring-green-200"
                    : "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-yellow-300"
              }`}
              required
              aria-required="true"
              aria-label="Full Name"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ValidationIcon isValid={validations.name} show={!!name} />
            </div>
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className={`w-full p-3 pr-10 border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                email
                  ? validations.email
                    ? "border-green-400 focus:ring-green-200"
                    : "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-yellow-300"
              }`}
              required
              aria-required="true"
              aria-label="Email"
              autoComplete="email"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ValidationIcon isValid={validations.email} show={!!email} />
            </div>
          </div>

          {/* Password */}
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(checkPasswordStrength(e.target.value));
              }}
              className={`w-full p-3 pr-20 border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                password
                  ? validations.password
                    ? "border-green-400 focus:ring-green-200"
                    : "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-yellow-300"
              }`}
              required
              aria-required="true"
              aria-label="Password"
              autoComplete="new-password"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <ValidationIcon isValid={validations.password} show={!!password} />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {password && (
            <div className="mb-4">
              <div className={`text-sm font-medium ${
                passwordStrength === "Strong"
                  ? "text-green-600"
                  : passwordStrength === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}>
                Password Strength: {passwordStrength}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength === "Strong"
                      ? "bg-green-500 w-full"
                      : passwordStrength === "Medium"
                      ? "bg-yellow-500 w-2/3"
                      : "bg-red-500 w-1/3"
                  }`}
                ></div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 pr-20 border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                confirmPassword
                  ? validations.confirmPassword
                    ? "border-green-400 focus:ring-green-200"
                    : "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-yellow-300"
              }`}
              required
              aria-required="true"
              aria-label="Confirm Password"
              autoComplete="new-password"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <ValidationIcon isValid={validations.confirmPassword} show={!!confirmPassword} />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Phone Number (10 digits)"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className={`w-full p-3 pr-10 border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                phone
                  ? validations.phone
                    ? "border-green-400 focus:ring-green-200"
                    : "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-yellow-300"
              }`}
              required
              aria-required="true"
              aria-label="Phone Number"
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ValidationIcon isValid={validations.phone} show={!!phone} />
            </div>

            {/* OTP Section - Only show when all details are valid */}
            {allDetailsValid && (
              <div className="mt-4">
                {!otpSent ? (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-medium shadow-lg flex items-center justify-center transition-all duration-200"
                    disabled={otpLoading || resendCooldown > 0}
                    aria-disabled={otpLoading || resendCooldown > 0}
                  >
                    {otpLoading && <FaSpinner className="animate-spin mr-2" />}
                    {otpLoading ? "Sending OTP..." : "📧 Send Email Verification"}
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: resendCooldown === 0 ? 1.02 : 1 }}
                      whileTap={{ scale: resendCooldown === 0 ? 0.98 : 1 }}
                      type="button"
                      onClick={handleSendOtp}
                      className={`py-2 px-4 rounded-2xl font-medium shadow-md flex items-center justify-center transition-all duration-200 ${
                        resendCooldown === 0
                          ? "bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
                          : "bg-gray-400 cursor-not-allowed text-white"
                      }`}
                      disabled={otpLoading || resendCooldown > 0}
                      aria-disabled={otpLoading || resendCooldown > 0}
                      aria-live="polite"
                    >
                      {otpLoading && <FaSpinner className="animate-spin mr-2" />}
                      {resendCooldown === 0 ? "🔄 Resend OTP" : `⏱️ ${resendCooldown}s`}
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OTP Input - Only show when OTP is sent */}
          {otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter ${OTP_LENGTH}-digit OTP from email`}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
                  }
                  className="w-full p-3 pr-10 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-300 text-center text-lg font-mono tracking-widest"
                  maxLength={OTP_LENGTH}
                  aria-label="OTP"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {otp.length === OTP_LENGTH && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaCheck className="text-green-500" />
                  </div>
                )}
              </div>

              {!otpVerified && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full mt-3 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-medium shadow-lg flex items-center justify-center transition-all duration-200"
                  disabled={verifyLoading || otp.length !== OTP_LENGTH}
                  aria-disabled={verifyLoading || otp.length !== OTP_LENGTH}
                >
                  {verifyLoading && <FaSpinner className="animate-spin mr-2" />}
                  {verifyLoading ? "Verifying..." : "✅ Verify Email"}
                </motion.button>
              )}

              {otpVerified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-2xl text-center"
                  role="alert"
                >
                  <p className="text-green-700 font-semibold flex items-center justify-center">
                    <FaCheck className="mr-2" />
                    Email Verified Successfully!
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 mb-4 text-center font-medium"
              role="alert"
              aria-live="polite"
            >
              {success}
            </motion.p>
          )}

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: otpVerified ? 1.02 : 1 }}
            whileTap={{ scale: otpVerified ? 0.98 : 1 }}
            type="submit"
            className={`w-full py-4 text-white rounded-2xl text-lg font-bold shadow-lg flex items-center justify-center transition-all duration-300 ${
              otpVerified 
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 cursor-pointer" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={loading || !otpVerified}
            aria-disabled={loading || !otpVerified}
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            {loading ? "Creating Account..." : "🚀 Create Account"}
          </motion.button>

          {!otpVerified && allDetailsValid && (
            <p className="text-xs text-gray-500 text-center mt-2" aria-live="polite">
              📧 Please verify your email to complete registration
            </p>
          )}

          {!allDetailsValid && (
            <p className="text-xs text-gray-500 text-center mt-2" aria-live="polite">
              ✏️ Complete all fields to proceed with email verification
            </p>
          )}
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                if (onLoginClick) onLoginClick();
                else navigate("/login");
              }}
              className="text-yellow-600 hover:text-yellow-700 font-semibold hover:underline transition-colors duration-200"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignupPage;