// FeaturedRestaurants.jsx — Dark Premium Design
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const getRandomRating = () => (Math.random() * 1.4 + 3.6).toFixed(1);

const CUISINE_COLORS = [
  "from-orange-500 to-red-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-indigo-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-yellow-500",
  "from-cyan-500 to-sky-500",
  "from-lime-500 to-green-500",
];

const FeaturedRestaurants = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chefs/getAllChefs`);
        const data = await res.json();
        setChefs(
          data.slice(0, 8).map((chef) => ({
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

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-orange-500/30 text-orange-400 bg-orange-500/10 mb-5">
            Meet the Chefs
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Your{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}>
              Home Chefs
            </span>
          </h2>
          <p className="mt-4 text-white/40 max-w-md mx-auto">Verified, passionate cooks making restaurant-quality food at home</p>
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
              className="group relative bg-white/[0.04] border border-white/[0.07] rounded-3xl p-6 text-center hover:border-orange-500/30 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedChef(chef)}
            >
              {/* Avatar with gradient ring */}
              <div className="relative mx-auto mb-4 w-20 h-20">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${CUISINE_COLORS[i % CUISINE_COLORS.length]} blur-sm opacity-60`} />
                <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${CUISINE_COLORS[i % CUISINE_COLORS.length]} flex items-center justify-center text-white text-2xl font-black border-2 border-white/10`}>
                  {chef.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
              </div>

              <h3 className="text-white font-bold text-base group-hover:text-orange-400 transition-colors">
                {chef.name}
              </h3>
              <p className="text-orange-400/70 text-xs font-medium mt-0.5 capitalize">
                {chef.cuisine?.join(", ") || "Multi-cuisine"}
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {[...Array(5)].map((_, j) => (
                  <FaStar key={j} size={11} className={j < Math.floor(chef.rating) ? "text-amber-400" : "text-white/10"} />
                ))}
                <span className="ml-1 text-xs text-white/40 font-medium">{chef.rating}</span>
              </div>

              <p className="text-white/30 text-xs mt-3 line-clamp-2 leading-relaxed">
                {chef.bio?.slice(0, 65) || "Serving authentic homemade meals with love."}
              </p>

              <button
                className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all"
                onClick={(e) => { e.stopPropagation(); setSelectedChef(chef); }}
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white text-sm border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 transition-all"
          >
            View All Chefs →
          </motion.button>
        </div>
      </div>

      {/* Chef Detail Modal */}
      {selectedChef && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedChef(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedChef(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition text-lg font-bold"
            >
              ×
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${CUISINE_COLORS[chefs.indexOf(selectedChef) % CUISINE_COLORS.length]} flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg`}>
                {selectedChef.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <h2 className="text-2xl font-black text-white">{selectedChef.name}</h2>
              <p className="text-orange-400 text-sm font-medium mt-1 capitalize">
                {selectedChef.cuisine?.join(", ") || "Multi-cuisine"}
              </p>
              {selectedChef.location && (
                <p className="text-white/30 text-xs mt-1">📍 {selectedChef.location}</p>
              )}
            </div>

            <div className="space-y-3 text-sm">
              {selectedChef.phone && (
                <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-4 py-3">
                  <span className="text-lg">📞</span>
                  <span className="text-white/60">{selectedChef.phone}</span>
                </div>
              )}
              {selectedChef.email && (
                <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-4 py-3">
                  <span className="text-lg">📧</span>
                  <span className="text-white/60">{selectedChef.email}</span>
                </div>
              )}
              {selectedChef.bio && (
                <div className="bg-white/[0.04] rounded-xl px-4 py-3">
                  <p className="text-white/40 text-xs leading-relaxed">{selectedChef.bio}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => { setSelectedChef(null); navigate("/meals"); }}
              className="mt-6 w-full py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}
            >
              Order from {selectedChef.name?.split(" ")[0]} →
            </button>
          </motion.div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </section>
  );
};

export default FeaturedRestaurants;