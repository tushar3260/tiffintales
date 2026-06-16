// FeaturedRestaurants.jsx — Light Mode
import React, { useEffect, useState } from "react";
import { FaStar, FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const getRandomRating = () => (Math.random() * 1.4 + 3.6).toFixed(1);

const AVATAR_GRADIENTS = [
  "from-orange-400 to-red-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-yellow-500",
  "from-cyan-400 to-sky-500",
  "from-lime-400 to-green-500",
];

// ✅ Safe location string extractor — handles object OR string
const getLocationStr = (loc) => {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") return loc.area || loc.city || loc.address || "";
  return "";
};

const FeaturedRestaurants = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/chefs/getAllChefs`);
        const raw  = await res.json();
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.chefs)
          ? raw.chefs
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        setChefs(
          list.slice(0, 8).map((chef) => ({
            ...chef,
            rating: parseFloat(getRandomRating()),
          }))
        );
      } catch {
        // silent — component renders empty gracefully
      }
    };
    fetchChefs();
  }, []);

  if (chefs.length === 0) return null;

  const closeModal = () => {
    setSelectedChef(null);
    document.body.style.overflow = "";
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-orange-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-badge">Meet the Chefs</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Home Chefs
            </span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-md mx-auto">
            Verified, passionate cooks making restaurant-quality food at home
          </p>
        </div>

        {/* Chef Cards Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {chefs.map((chef, i) => (
            <motion.div
              key={chef._id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-orange-100 rounded-3xl p-6 text-center hover:border-orange-300 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-sm"
              onClick={() => {setSelectedChef(chef); document.body.style.overflow = "hidden";}}
            >
              {/* Avatar with gradient ring */}
              <div className="relative mx-auto mb-4 w-20 h-20">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} blur-sm opacity-40`} />
                <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                  {chef.photo
                    ? <img src={chef.photo} alt={chef.name} className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display='none'; }} />
                    : chef.name?.charAt(0)?.toUpperCase() || "C"
                  }
                </div>
              </div>

              <h3 className="text-gray-900 font-bold text-base group-hover:text-orange-500 transition-colors">
                {chef.name}
              </h3>
              <p className="text-orange-500 text-xs font-medium mt-0.5 capitalize">
                {chef.cuisine?.join(", ") || "Multi-cuisine"}
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {[...Array(5)].map((_, j) => (
                  <FaStar key={j} size={11} className={j < Math.floor(chef.rating) ? "text-amber-400" : "text-gray-200"} />
                ))}
                <span className="ml-1 text-xs text-gray-400 font-medium">{chef.rating}</span>
              </div>

              <p className="text-gray-400 text-xs mt-3 line-clamp-2 leading-relaxed">
                {chef.bio?.slice(0, 65) || "Serving authentic homemade meals with love."}
              </p>

              <button
                className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-orange-500 border border-orange-200 hover:bg-orange-50 hover:border-orange-400 transition-all"
                onClick={(e) => { e.stopPropagation(); setSelectedChef(chef); document.body.style.overflow = "hidden"; }}
              >
                View Profile
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/allchef")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-orange-500 to-red-500 shadow-lg hover:shadow-xl transition-all"
          >
            View All Chefs →
          </motion.button>
        </div>
      </div>

      {/* Chef Detail Modal */}
      <AnimatePresence>
        {selectedChef && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
              >
                <FaTimes size={12} />
              </button>

              {/* Modal Header */}
              <div className={`bg-gradient-to-br ${AVATAR_GRADIENTS[chefs.indexOf(selectedChef) % AVATAR_GRADIENTS.length]} p-8 text-center`}>
                <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center text-white text-3xl font-black mx-auto mb-3 shadow-lg overflow-hidden">
                  {selectedChef.photo
                    ? <img src={selectedChef.photo} alt={selectedChef.name} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none';}} />
                    : selectedChef.name?.charAt(0)?.toUpperCase() || "C"
                  }
                </div>
                <h2 className="text-2xl font-black text-white">{selectedChef.name}</h2>
                <p className="text-white/80 text-sm mt-1 capitalize">
                  {selectedChef.cuisine?.join(", ") || "Multi-cuisine"}
                </p>
                {/* ✅ FIX: safe location string, no object render */}
                {getLocationStr(selectedChef.location) && (
                  <p className="text-white/60 text-xs mt-1 flex items-center justify-center gap-1">
                    <FaMapMarkerAlt size={10} /> {getLocationStr(selectedChef.location)}
                  </p>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-3">
                {selectedChef.phone && (
                  <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3">
                    <FaPhone className="text-orange-400" size={14} />
                    <span className="text-gray-700 text-sm">{selectedChef.phone}</span>
                  </div>
                )}
                {selectedChef.email && (
                  <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3">
                    <FaEnvelope className="text-orange-400" size={14} />
                    <span className="text-gray-700 text-sm">{selectedChef.email}</span>
                  </div>
                )}
                {selectedChef.bio && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedChef.bio}</p>
                  </div>
                )}

                <button
                  onClick={() => { closeModal(); navigate("/meals"); }}
                  className="mt-2 w-full py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-orange-500 to-red-500 shadow hover:shadow-md transition"
                >
                  Order from {selectedChef.name?.split(" ")[0]} →
                </button>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedRestaurants;