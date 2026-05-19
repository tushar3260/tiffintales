// ProfilePage.jsx — Production Ready
// Full profile management: edit info, manage addresses, logout
import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSignOutAlt, FaEdit, FaMapMarkerAlt, FaTrash, FaPlus,
  FaSave, FaTimes, FaArrowLeft, FaUser, FaPhone, FaEnvelope,
  FaCheck, FaHome, FaBuilding, FaBriefcase,
} from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../context/userContext.jsx";
import { storage } from "../utils/Storage.js";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";

const BASE = import.meta.env.VITE_API_URL;

const ADDRESS_TAGS = [
  { label: "Home", icon: <FaHome /> },
  { label: "Work", icon: <FaBriefcase /> },
  { label: "Other", icon: <FaBuilding /> },
];

function ProfilePage() {
  const { user, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile | addresses | security

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", avtar: "", address: [],
  });

  const [newAddress, setNewAddress] = useState({
    tag: "Home", street: "", city: "", pincode: "",
  });

  useEffect(() => {
    storage.getItem("usertoken").then((t) => setUserToken(t || ""));
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        avtar: user.avtar || "",
        address: user.address || [],
      });
    }
  }, [user]);

  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const handleSaveProfile = async () => {
    if (!user?._id) return;
    setSaving(true);
    try {
      const res = await axios.put(
        `${BASE}/user/update`,
        { fullName: formData.fullName, phone: formData.phone, avtar: formData.avtar },
        { headers: authHeader }
      );
      setUser(res.data.user || { ...user, ...formData });
      setEditing(false);
      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.pincode) {
      return toast.error("Please fill in all address fields");
    }
    try {
      const res = await axios.post(
        `${BASE}/user/${user._id}/address`,
        newAddress,
        { headers: authHeader }
      );
      const updated = res.data.addresses || [...formData.address, newAddress];
      setFormData((prev) => ({ ...prev, address: updated }));
      setUser((prev) => ({ ...prev, address: updated }));
      setNewAddress({ tag: "Home", street: "", city: "", pincode: "" });
      setAddingAddress(false);
      toast.success("📍 Address saved!");
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (idx) => {
    try {
      const addr = formData.address[idx];
      if (addr._id) {
        await axios.delete(`${BASE}/user/${user._id}/address/${addr._id}`, { headers: authHeader });
      }
      const updated = formData.address.filter((_, i) => i !== idx);
      setFormData((prev) => ({ ...prev, address: updated }));
      setUser((prev) => ({ ...prev, address: updated }));
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  const handleLogout = () => {
    storage.removeItem("userData");
    storage.removeItem("usertoken");
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 800);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 gap-4">
        <p className="text-gray-600 font-semibold">Please login to view your profile</p>
        <button onClick={() => navigate("/login")} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">Login</button>
      </div>
    );
  }

  const initials = formData.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <>
      <Toaster position="top-right" />
      <TopNav onLoginClick={() => navigate("/login")} onSignupClick={() => navigate("/signup")} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Back button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6 font-semibold transition">
            <FaArrowLeft /> Back
          </button>

          {/* Profile Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl mb-6 relative overflow-hidden"
          >
            {/* bg decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {formData.avtar ? (
                  <img
                    src={formData.avtar}
                    alt={formData.fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 border-4 border-white/30 flex items-center justify-center text-3xl font-extrabold shadow-xl">
                    {initials}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{formData.fullName || "Your Name"}</h1>
                <p className="text-orange-100 text-sm mt-1">{formData.email}</p>
                <p className="text-orange-100 text-sm">{formData.phone || "No phone set"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-semibold text-sm transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-6">
            {["profile", "addresses"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab === "profile" ? "👤 Profile Info" : "📍 My Addresses"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl shadow-md border border-orange-100 p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-100 transition"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-500 text-sm hover:bg-gray-100 transition"
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:shadow-md transition disabled:opacity-60"
                      >
                        <FaSave /> {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", key: "fullName", icon: <FaUser />, editable: true },
                    { label: "Email Address", key: "email", icon: <FaEnvelope />, editable: false },
                    { label: "Phone Number", key: "phone", icon: <FaPhone />, editable: true },
                    { label: "Avatar URL", key: "avtar", icon: <FaUser />, editable: true },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                        {field.label}
                      </label>
                      {editing && field.editable ? (
                        <input
                          value={formData[field.key]}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-orange-400">{field.icon}</span>
                          <span className="text-gray-800 text-sm font-medium">
                            {formData[field.key] || <span className="text-gray-400 italic">Not set</span>}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick links */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid sm:grid-cols-3 gap-3">
                  {[
                    { label: "My Orders", path: "/orders", emoji: "📦" },
                    { label: "Dashboard", path: "/dashboard", emoji: "🏠" },
                    { label: "Subscriptions", path: "/dashboard/subscription", emoji: "📋" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 transition text-left"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Addresses Tab ── */}
            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl shadow-md border border-orange-100 p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    <FaMapMarkerAlt className="inline text-orange-500 mr-2" />
                    Saved Addresses
                  </h2>
                  <button
                    onClick={() => setAddingAddress(!addingAddress)}
                    className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-100 transition"
                  >
                    {addingAddress ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Address</>}
                  </button>
                </div>

                {/* Add Address Form */}
                <AnimatePresence>
                  {addingAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="bg-orange-50 rounded-2xl p-5 border border-orange-200">
                        <h3 className="font-bold text-gray-800 mb-4 text-sm">New Address</h3>

                        {/* Tag */}
                        <div className="flex gap-2 mb-4">
                          {ADDRESS_TAGS.map((t) => (
                            <button
                              key={t.label}
                              onClick={() => setNewAddress((prev) => ({ ...prev, tag: t.label }))}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition ${
                                newAddress.tag === t.label
                                  ? "border-orange-400 bg-orange-100 text-orange-700"
                                  : "border-gray-200 text-gray-600 bg-white hover:border-orange-300"
                              }`}
                            >
                              {t.icon} {t.label}
                            </button>
                          ))}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mb-4">
                          <input
                            value={newAddress.street}
                            onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                            placeholder="Street / Flat no."
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                          />
                          <input
                            value={newAddress.city}
                            onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                            placeholder="City"
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                          />
                          <input
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress((p) => ({ ...p, pincode: e.target.value }))}
                            placeholder="Pincode"
                            maxLength={6}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleAddAddress}
                          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow hover:shadow-md transition"
                        >
                          <FaCheck /> Save Address
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Saved Addresses */}
                {formData.address.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FaMapMarkerAlt className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold">No addresses saved yet</p>
                    <p className="text-sm mt-1">Add a delivery address to speed up checkout</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.address.map((addr, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="flex items-start justify-between p-4 rounded-2xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                            {addr.tag === "Work" ? <FaBriefcase /> : addr.tag === "Other" ? <FaBuilding /> : <FaHome />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                              {addr.tag || "Address"}
                            </span>
                            <p className="font-semibold text-gray-800 text-sm mt-1">
                              {addr.street}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {addr.city}{addr.pincode && ` - ${addr.pincode}`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-gray-300 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
                          title="Delete address"
                        >
                          <FaTrash size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
