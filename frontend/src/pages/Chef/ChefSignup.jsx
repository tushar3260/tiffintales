import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ChefContext from "./Context/ChefContext";
import Loading from "../../Loading";
import { storage } from "../../utils/Storage";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "../../utils/cloudinaryUpload";

const OTP_LENGTH = 6;
const OTP_RESEND_COOLDOWN = 60; // seconds

const ChefSignup = ({ onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    passwordHash: "",
    bio: "",
    cuisine: "",
    kitchenImages: [],
    documents: { aadhaar: "", pan: "" },
    bankDetails: { accNo: "", ifsc: "", holderName: "" },
    location: { area: "", lat: "", lng: "" },
  });

  const { setChef, setChefToken } = useContext(ChefContext);
  const [loading, setLoading] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);
  
  // Upload states
  const [uploadingKitchen, setUploadingKitchen] = useState(false);
  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  
  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimerRef = useRef(null);
  
  // Validation states
  const [validations, setValidations] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    cuisine: false,
    bankDetails: false,
    location: false,
  });
  
  const navigate = useNavigate();

  // Reset OTP states on email change
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setResendCooldown(0);
  }, [formData.email]);

  // Handle OTP resend cooldown timer
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

  // Real-time validation
  useEffect(() => {
    setValidations({
      name: formData.name.trim().length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      phone: /^[6-9]\d{9}$/.test(formData.phone),
      password: formData.passwordHash.length >= 6,
      cuisine: formData.cuisine.length > 0,
      bankDetails: formData.bankDetails.accNo && formData.bankDetails.ifsc && formData.bankDetails.holderName,
      location: formData.location.lat && formData.location.lng && formData.location.area,
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("bankDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [key]: value },
      }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else if (name === "cuisine") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((v) => v.trim()),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Kitchen Images Upload (Multiple)
  const handleKitchenImagesUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 5) {
      toast.error("Maximum 5 kitchen images allowed");
      return;
    }

    setUploadingKitchen(true);
    toast.loading("Uploading kitchen images...", { id: "kitchen" });

    try {
      const urls = await uploadMultipleToCloudinary(files);
      
      setFormData((prev) => ({
        ...prev,
        kitchenImages: urls,
      }));

      toast.success(`${urls.length} images uploaded successfully!`, { id: "kitchen" });
    } catch (error) {
      console.error("Kitchen upload error:", error);
      toast.error(error.message || "Failed to upload kitchen images", { id: "kitchen" });
    } finally {
      setUploadingKitchen(false);
    }
  };

  // Handle Aadhaar Upload (Single)
  const handleAadhaarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAadhaar(true);
    toast.loading("Uploading Aadhaar...", { id: "aadhaar" });

    try {
      const url = await uploadToCloudinary(file);
      
      setFormData((prev) => ({
        ...prev,
        documents: { ...prev.documents, aadhaar: url },
      }));

      toast.success("Aadhaar uploaded successfully!", { id: "aadhaar" });
    } catch (error) {
      console.error("Aadhaar upload error:", error);
      toast.error(error.message || "Failed to upload Aadhaar", { id: "aadhaar" });
    } finally {
      setUploadingAadhaar(false);
    }
  };

  // Handle PAN Upload (Single)
  const handlePanUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPan(true);
    toast.loading("Uploading PAN...", { id: "pan" });

    try {
      const url = await uploadToCloudinary(file);
      
      setFormData((prev) => ({
        ...prev,
        documents: { ...prev.documents, pan: url },
      }));

      toast.success("PAN uploaded successfully!", { id: "pan" });
    } catch (error) {
      console.error("PAN upload error:", error);
      toast.error(error.message || "Failed to upload PAN", { id: "pan" });
    } finally {
      setUploadingPan(false);
    }
  };

  // Remove a kitchen image
  const removeKitchenImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      kitchenImages: prev.kitchenImages.filter((_, i) => i !== index),
    }));
    toast.success("Image removed");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const address = data.display_name || "Address not found";

          setFormData((prev) => ({
            ...prev,
            location: {
              area: address,
              lat: lat.toString(),
              lng: lng.toString(),
            },
          }));

          setLocationFetched(true);
          toast.success("📍 Location detected: " + address);
        } catch (error) {
          toast.error("Failed to fetch address");
        }
      },
      () => {
        toast.error("Failed to access location. Please enter manually.");
      }
    );
  };

  // Check if basic details are valid for OTP
  const basicDetailsValid = validations.name && validations.email && validations.phone && validations.password;

  // Check if all details are complete
  const allDetailsComplete = basicDetailsValid && 
    validations.cuisine && 
    validations.bankDetails && 
    validations.location &&
    formData.kitchenImages.length > 0 &&
    formData.documents.aadhaar &&
    formData.documents.pan;

  // Send OTP handler
  const handleSendOtp = async () => {
    if (!basicDetailsValid) {
      toast.error("Please complete Name, Email, Phone, and Password fields correctly");
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
        { email: formData.email, role: "chef" }
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
    if (otp.length !== OTP_LENGTH) {
      toast.error(`Please enter a valid ${OTP_LENGTH}-digit OTP`);
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/otp/verify-otp`,
        { email: formData.email, role: "chef", otp }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allDetailsComplete) {
      toast.error("❌ Please complete all required fields");
      return;
    }

    if (!otpVerified) {
      toast.error("❌ Please verify your email with OTP before registering");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chefs/register`,
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Chef registered successfully!");
      
      const token = res.data.token;
      const chef = res.data.chef;

      if (token) {
        storage.setItem("chefToken", token);
        storage.setItem("chefData", chef);
        storage.setItem("chefEmail", chef.email);
        setChef(chef);
        setChefToken(token);
      }
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        passwordHash: "",
        bio: "",
        cuisine: "",
        kitchenImages: [],
        documents: { aadhaar: "", pan: "" },
        bankDetails: { accNo: "", ifsc: "", holderName: "" },
        location: { area: "", lat: "", lng: "" },
      });
      setLocationFetched(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/chef");
  };
  
  const handleLogin = () => {
    if (onLoginClick) onLoginClick();
    else navigate("/chef/login");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {loading && <Loading message="Registering Chef..." />}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-3xl w-full border border-orange-300 z-10 overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-[#ff7e00] text-center">
          Chef Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-3 pr-10 rounded-xl border focus:outline-none transition-all ${
                  formData.name
                    ? validations.name
                      ? "border-green-400 focus:ring-2 focus:ring-green-200"
                      : "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-orange-400"
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ValidationIcon isValid={validations.name} show={!!formData.name} />
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-3 pr-10 rounded-xl border focus:outline-none transition-all ${
                  formData.email
                    ? validations.email
                      ? "border-green-400 focus:ring-2 focus:ring-green-200"
                      : "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-orange-400"
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ValidationIcon isValid={validations.email} show={!!formData.email} />
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                name="phone"
                placeholder="Phone (10-digit)"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={10}
                className={`w-full p-3 pr-10 rounded-xl border focus:outline-none transition-all ${
                  formData.phone
                    ? validations.phone
                      ? "border-green-400 focus:ring-2 focus:ring-green-200"
                      : "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-orange-400"
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ValidationIcon isValid={validations.phone} show={!!formData.phone} />
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                name="passwordHash"
                placeholder="Password (min 6 characters)"
                value={formData.passwordHash}
                onChange={handleChange}
                required
                className={`w-full p-3 pr-10 rounded-xl border focus:outline-none transition-all ${
                  formData.passwordHash
                    ? validations.password
                      ? "border-green-400 focus:ring-2 focus:ring-green-200"
                      : "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-orange-400"
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ValidationIcon isValid={validations.password} show={!!formData.passwordHash} />
              </div>
            </div>
          </div>

          {/* OTP Section - Show when basic details are valid */}
          {basicDetailsValid && (
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-700">
                  📧 Email Verification Required
                </span>
                {otpVerified && (
                  <span className="text-green-600 text-sm font-semibold flex items-center">
                    <FaCheck className="mr-1" /> Verified
                  </span>
                )}
              </div>

              {!otpSent ? (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg flex items-center justify-center transition-all"
                  disabled={otpLoading || resendCooldown > 0}
                >
                  {otpLoading && <FaSpinner className="animate-spin mr-2" />}
                  {otpLoading ? "Sending OTP..." : "📧 Send Verification Code"}
                </motion.button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: resendCooldown === 0 ? 1.02 : 1 }}
                      whileTap={{ scale: resendCooldown === 0 ? 0.98 : 1 }}
                      type="button"
                      onClick={handleSendOtp}
                      className={`py-2 px-4 rounded-xl font-medium shadow-md flex items-center justify-center transition-all ${
                        resendCooldown === 0
                          ? "bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
                          : "bg-gray-400 cursor-not-allowed text-white"
                      }`}
                      disabled={otpLoading || resendCooldown > 0}
                    >
                      {otpLoading && <FaSpinner className="animate-spin mr-2" />}
                      {resendCooldown === 0 ? "🔄 Resend OTP" : `⏱️ ${resendCooldown}s`}
                    </motion.button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Enter ${OTP_LENGTH}-digit OTP`}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
                      }
                      className="w-full p-3 pr-10 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 text-center text-lg font-mono tracking-widest"
                      maxLength={OTP_LENGTH}
                      inputMode="numeric"
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
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg flex items-center justify-center transition-all"
                      disabled={verifyLoading || otp.length !== OTP_LENGTH}
                    >
                      {verifyLoading && <FaSpinner className="animate-spin mr-2" />}
                      {verifyLoading ? "Verifying..." : "✅ Verify Email"}
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          )}

          <textarea
            name="bio"
            placeholder="Short Bio (optional)"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none"
            rows="3"
          />

          <input
            type="text"
            name="cuisine"
            placeholder="Cuisines (comma separated, e.g., Italian, Chinese)"
            value={formData.cuisine}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none"
          />

          {/* Kitchen Images Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Kitchen Images (Max 5) *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleKitchenImagesUpload}
              disabled={uploadingKitchen}
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            
            {formData.kitchenImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.kitchenImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Kitchen ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeKitchenImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aadhaar */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Aadhaar Document *
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleAadhaarUpload}
                disabled={uploadingAadhaar}
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {formData.documents.aadhaar && (
                <div className="relative">
                  <img
                    src={formData.documents.aadhaar}
                    alt="Aadhaar"
                    className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                  />
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Uploaded
                  </span>
                </div>
              )}
            </div>

            {/* PAN */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                PAN Document *
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handlePanUpload}
                disabled={uploadingPan}
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {formData.documents.pan && (
                <div className="relative">
                  <img
                    src={formData.documents.pan}
                    alt="PAN"
                    className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                  />
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Uploaded
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bank Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="bankDetails.accNo"
              placeholder="Account Number"
              value={formData.bankDetails.accNo}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none"
            />
            <input
              type="text"
              name="bankDetails.ifsc"
              placeholder="IFSC Code"
              value={formData.bankDetails.ifsc}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none"
            />
            <input
              type="text"
              name="bankDetails.holderName"
              placeholder="Account Holder Name"
              value={formData.bankDetails.holderName}
              onChange={handleChange}
              required
              className="p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none"
            />
          </div>

          {/* Location */}
          <input
            type="text"
            name="location.area"
            placeholder="Area / Locality"
            value={formData.location.area}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={detectLocation}
            disabled={locationFetched}
            className={`text-[#ff7e00] underline mb-2 ${
              locationFetched ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            📍{" "}
            {locationFetched ? "Location Detected ✅" : "Auto Detect Location"}
          </button>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: otpVerified && allDetailsComplete ? 1.05 : 1 }}
            whileTap={{ scale: otpVerified && allDetailsComplete ? 0.95 : 1 }}
            type="submit"
            disabled={loading || uploadingKitchen || uploadingAadhaar || uploadingPan || !otpVerified || !allDetailsComplete}
            className={`w-full py-3 ${
              loading || uploadingKitchen || uploadingAadhaar || uploadingPan || !otpVerified || !allDetailsComplete
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ff7e00] hover:bg-orange-600"
            } text-white rounded-xl mt-4 font-semibold transition-all duration-300`}
          >
            {loading
              ? "Registering..."
              : uploadingKitchen || uploadingAadhaar || uploadingPan
              ? "Uploading files..."
              : "🚀 Register as Chef"}
          </motion.button>

          {/* Helper messages */}
          {!basicDetailsValid && (
            <p className="text-xs text-gray-500 text-center mt-2">
              ✏️ Complete Name, Email, Phone, and Password to verify email
            </p>
          )}
          
          {basicDetailsValid && !otpVerified && (
            <p className="text-xs text-gray-500 text-center mt-2">
              📧 Please verify your email to continue registration
            </p>
          )}
          
          {otpVerified && !allDetailsComplete && (
            <p className="text-xs text-orange-600 text-center mt-2">
              ⚠️ Please complete all remaining fields and upload required documents
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={handleLogin}
            className="text-[#ff7e00] underline font-semibold hover:text-orange-600"
          >
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ChefSignup;