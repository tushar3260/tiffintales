import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/userContext.jsx";

const AddLocation= ({ isOpen, onClose }) => {
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [tag, setTag] = useState("Home");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { user } = useUser();
  const userId = user?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/${userId}/address`,
        { pincode, city, street, tag },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      toast.success("✅ Address added successfully!");
      console.log(res.data);

      setPincode("");
      setCity("");
      setStreet("");
      setTag("Home");
      onClose();
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(err.response?.data?.message || "Failed to add address!");
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported!");
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Coordinates:", latitude, longitude);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.address || {};

          setStreet(address.road || "");
          setCity(address.city || address.town || address.village || "");
          setPincode(address.postcode || "");

          toast.success("📍 Location detected!");
        } catch (error) {
          console.error(error);
          toast.error("Failed to detect location");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        toast.error("Permission denied or error");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative"
          >
            <Toaster position="top-center" />
            <h2 className="text-xl font-bold text-center mb-4 text-orange-600">
              Add New Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />

              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />

              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>

              <button
                type="button"
                onClick={detectLocation}
                className="w-full py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                disabled={loadingLocation}
              >
                {loadingLocation ? "Detecting..." : "📍 Detect My Location"}
              </button>

              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 py-2 rounded-xl hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddLocation;
