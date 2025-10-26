import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSignOutAlt,
  FaEdit,
  FaMapMarkerAlt,
  FaHeart,
  FaTrash,
  FaPlus,
  FaSave,
  FaUpload,
  FaArrowLeft,
} from "react-icons/fa";
import Loading from "../Loading.jsx";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../context/userContext.jsx";
import { storage } from "../utils/Storage.js";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user, setUser, setToken } = useContext(UserContext);
  const [userToken, setUserToken] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    avtar: "",
    address: [],
  });

  const [newAddress, setNewAddress] = useState({
    tag: "Home",
    street: "",
    city: "",
    pincode: "",
  });

  // ✅ Fetch token
  useEffect(() => {
    const fetchToken = async () => {
      const token = await storage.getItem("usertoken");
      setUserToken(token || "");
    };
    fetchToken();
  }, []);

  // ✅ Sync user data
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

  // ✅ Logout
  const handleLogout = () => {
    storage.clear();
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 800);
  };

  // ✅ Handle inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, avtar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // ✅ Add address
  const handleAddAddress = () => {
    if (
      !newAddress.tag ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.pincode
    ) {
      return toast.error("Please fill all address fields!");
    }
    setFormData({
      ...formData,
      address: [...formData.address, { ...newAddress, createdAt: new Date() }],
    });
    setNewAddress({ tag: "Home", street: "", city: "", pincode: "" });
    toast.success("Address added!");
  };

  // ✅ Delete address
  const handleDeleteAddress = (index) => {
    const updatedAddresses = formData.address.filter((_, i) => i !== index);
    setFormData({ ...formData, address: updatedAddresses });
    toast.success("Address removed!");
  };

  // ✅ Update profile
  const handleUpdate = async () => {
    if (!userToken) return toast.error("User token not found!");
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update`,
        {
          fullName: formData.fullName,
          phone: formData.phone,
          avtar: formData.avtar,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      if (data.success) {
        setUser(data.user);
        setEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update Error:", error);
      setLoading(false);
      toast.error("Error updating profile");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      {/* 🔙 Back Button (No Refresh) */}
      <div className="fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-400 transition"
        >
          <FaArrowLeft className="text-sm" />
          <span className="hidden sm:inline font-semibold">Back</span>
        </motion.button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4 sm:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 border border-orange-200"
        >
          {/* LEFT SECTION */}
          <div className="flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-4">
            <div className="relative">
              <motion.img
                src={
                  formData.avtar ||
                  "https://images.unsplash.com/photo-1614281424829-46986c1b2f9c?auto=format&fit=crop&w=300&q=80"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-orange-400 shadow-lg mb-4 object-cover"
                whileHover={{ scale: 1.05 }}
              />
              {editing && (
                <label className="absolute bottom-2 right-2 bg-orange-500 text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-orange-400 transition">
                  <FaUpload />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            {editing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="text-xl font-bold text-center border rounded p-1 w-full mb-2"
              />
            ) : (
              <h2 className="text-2xl font-extrabold text-orange-600">
                {formData.fullName || "Foodie Lover"}
              </h2>
            )}
            <p className="text-gray-500 text-sm mb-3">
              {formData.email || "foodie@example.com"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl text-sm shadow flex items-center justify-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>

          {/* RIGHT SECTION */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Personal Info */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-5 shadow-md border border-orange-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-orange-600">
                  Personal Info
                </h3>
                <button
                  onClick={() => (editing ? handleUpdate() : setEditing(true))}
                  className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm"
                >
                  {editing ? <FaSave /> : <FaEdit />}
                  {editing ? "Save" : "Edit"}
                </button>
              </div>
              {editing ? (
                <>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full p-2 border rounded mb-2"
                  />
                </>
              ) : (
                <>
                  <p className="mb-1">
                    <strong>Full Name:</strong> {formData.fullName || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {formData.email || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {formData.phone || "N/A"}
                  </p>
                </>
              )}
            </motion.div>

            {/* Address Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-5 shadow-md border border-orange-100"
            >
              <h3 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                <FaMapMarkerAlt /> Saved Addresses
              </h3>
              {formData.address.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.address.map((addr, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 shadow-sm border border-orange-200 relative"
                    >
                      <p className="font-semibold text-gray-700">{addr.tag}</p>
                      <p className="text-sm text-gray-600">
                        {addr.street}, {addr.city} - {addr.pincode}
                      </p>
                      {editing && (
                        <button
                          onClick={() => handleDeleteAddress(i)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No saved addresses.</p>
              )}

              {editing && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="font-semibold mb-2 text-orange-600 flex items-center gap-1">
                    <FaPlus /> Add Address
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newAddress.tag}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, tag: e.target.value })
                      }
                      className="p-2 border rounded"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, pincode: e.target.value })
                      }
                      className="p-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={handleAddAddress}
                    className="mt-2 bg-green-500 hover:bg-green-400 text-white py-1 px-3 rounded"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </motion.div>

            {/* Favorites */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-orange-50 rounded-xl p-5 shadow-md border border-orange-100 transition-all"
            >
              <h3 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                <FaHeart /> Favorites
              </h3>
              {user?.favorites?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.favorites.map((chefId, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white text-orange-600 rounded-full shadow-sm text-sm font-medium border border-orange-200"
                    >
                      Chef ID: {chefId}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No favorites added yet.</p>
              )}
            </motion.div>
          </div>
          {loading && <Loading message="Updating..." />}
        </motion.div>
      </div>
    </>
  );
}

export default ProfilePage;
