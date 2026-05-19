// AllChef.jsx — Production Ready
// Real data: chefs, reviews, meals count. Search + cuisine filter.
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaStar, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaUtensils, FaSearch, FaFilter, FaShoppingBag,
} from "react-icons/fa";
import Loading from "../Loading.jsx";
import TopNav from "../components/TopNav.jsx";

const BASE = import.meta.env.VITE_API_URL;

function StarRow({ rating = 0, count }) {
  const r = parseFloat(rating) || 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <FaStar
            key={i}
            className={i <= Math.round(r) ? "text-yellow-400" : "text-gray-300"}
            size={13}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-[#6B3A1E]">{r > 0 ? r.toFixed(1) : "New"}</span>
      {count > 0 && <span className="text-xs text-gray-500">({count})</span>}
    </div>
  );
}

const Allchef = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chefs, setChefs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE}/chefs/getAllChefs`),
      axios.get(`${BASE}/reviews`),
    ])
      .then(([chefsRes, reviewsRes]) => {
        setChefs(Array.isArray(chefsRes.data) ? chefsRes.data : []);
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Compute avg rating + review count per chef
  const getChefStats = (chefId) => {
    const chefReviews = reviews.filter((r) => String(r.chefId?._id || r.chefId) === String(chefId));
    const avg = chefReviews.length
      ? chefReviews.reduce((s, r) => s + (r.rating || 0), 0) / chefReviews.length
      : 0;
    return { avg: avg.toFixed(1), count: chefReviews.length };
  };

  // All unique cuisines for filter
  const allCuisines = ["All", ...new Set(chefs.flatMap((c) => c.cuisine || []).filter(Boolean))];

  const filtered = chefs.filter((chef) => {
    const matchSearch = chef.name?.toLowerCase().includes(search.toLowerCase());
    const matchCuisine =
      cuisineFilter === "All" || chef.cuisine?.includes(cuisineFilter);
    return matchSearch && matchCuisine;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF7EB]">
      <Loading />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF7EB] px-4">
      <div className="text-center bg-white rounded-3xl p-10 shadow-2xl">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-[#E57A44] text-xl font-bold mb-3">Failed to load chefs</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <>
      <TopNav onLoginClick={() => navigate("/login")} onSignupClick={() => navigate("/signup")} />

      <section className="relative bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F]/40 min-h-screen pt-24 pb-16 px-4 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-40 left-20 w-96 h-96 bg-[#F7C35F] rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#E57A44] rounded-full blur-3xl opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1
              className="text-4xl sm:text-5xl font-bold text-[#6B3A1E] mb-3"
              style={{ fontFamily: "Georgia, serif", textShadow: "0 2px 20px rgba(247,195,95,0.3)" }}
            >
              Our Master Chefs 👨‍🍳
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-3" />
            <p className="text-[#6B3A1E]/70 text-base max-w-xl mx-auto">
              {filtered.length} passionate home chefs. Authentic flavors, made with love.
            </p>
          </motion.div>

          {/* Search + Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-8"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E57A44]" />
              <input
                type="text"
                placeholder="Search chef by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-xl border-2 border-white/80 rounded-2xl text-[#6B3A1E] placeholder-[#6B3A1E]/50 focus:outline-none focus:border-[#E57A44] transition shadow-md"
              />
            </div>
            <select
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="py-3 px-4 bg-white/70 backdrop-blur-xl border-2 border-white/80 rounded-2xl text-[#6B3A1E] focus:outline-none focus:border-[#E57A44] transition shadow-md font-semibold"
            >
              {allCuisines.map((c) => (
                <option key={c} value={c}>{c === "All" ? "🍽 All Cuisines" : c}</option>
              ))}
            </select>
          </motion.div>

          {/* Chef Detail Modal */}
          <AnimatePresence>
            {selectedChef && (() => {
              const stats = getChefStats(selectedChef._id);
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[#6B3A1E]/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedChef(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="bg-white/97 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedChef(null)}
                      className="absolute top-4 right-4 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition"
                    >
                      <FaTimes className="text-[#6B3A1E]" />
                    </button>

                    {/* Modal Header */}
                    <div className="relative bg-gradient-to-br from-[#E57A44] to-[#F7C35F] p-8 rounded-t-3xl text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                        <img
                          src={selectedChef.photo || "https://cdn-icons-png.flaticon.com/512/1721/1721307.png"}
                          alt={selectedChef.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/1721/1721307.png"; }}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{selectedChef.name}</h3>
                      <div className="flex items-center justify-center gap-2 text-white/90 mt-1 text-sm">
                        <FaMapMarkerAlt />
                        <span>{selectedChef.location?.area || selectedChef.location || "Home Chef"}</span>
                      </div>
                      <div className="flex justify-center mt-3">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                          <StarRow rating={stats.avg} count={stats.count} />
                        </div>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-4">
                      {/* Specialties */}
                      <div>
                        <p className="text-sm font-bold text-[#6B3A1E] mb-2 flex items-center gap-2">
                          <FaUtensils className="text-[#E57A44]" /> Specialties
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedChef.cuisine || []).map((c) => (
                            <span key={c} className="px-3 py-1 bg-orange-100 text-[#6B3A1E] rounded-full text-xs font-semibold">
                              {c}
                            </span>
                          ))}
                          {(!selectedChef.cuisine?.length) && (
                            <span className="text-gray-400 text-sm">Not specified</span>
                          )}
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#FFF7EB] rounded-xl p-3 border border-[#E57A44]/20">
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-sm font-semibold text-[#6B3A1E]">{selectedChef.phone || "N/A"}</p>
                        </div>
                        <div className="bg-[#FFF7EB] rounded-xl p-3 border border-[#E57A44]/20">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-semibold text-[#6B3A1E] truncate">{selectedChef.email || "N/A"}</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="bg-[#FFF7EB] rounded-xl p-4 border border-[#E57A44]/20">
                        <p className="text-sm text-[#6B3A1E]/80 leading-relaxed">
                          {selectedChef.bio || "A passionate home chef dedicated to creating authentic, delicious meals with fresh ingredients."}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => { navigate("/meals"); setSelectedChef(null); }}
                          className="flex-1 py-3 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition text-sm flex items-center justify-center gap-2"
                        >
                          <FaShoppingBag /> Order Now
                        </button>
                        <button
                          onClick={() => setSelectedChef(null)}
                          className="flex-1 py-3 border-2 border-[#E57A44]/30 text-[#6B3A1E] font-semibold rounded-2xl hover:border-[#E57A44] transition text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Chefs Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">👨‍🍳</p>
              <p className="text-[#6B3A1E] text-xl font-semibold">No chefs found</p>
              <button onClick={() => { setSearch(""); setCuisineFilter("All"); }} className="mt-3 text-orange-500 underline text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            >
              {filtered.map((chef) => {
                const stats = getChefStats(chef._id);
                return (
                  <motion.div
                    key={chef._id}
                    variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-3xl blur-xl opacity-0 group-hover:opacity-25 transition-all duration-500 -z-10" />

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-white/80">
                      {/* Top Badge */}
                      {stats.avg >= 4 && (
                        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow">
                          ⭐ Top Rated
                        </div>
                      )}

                      {/* Avatar */}
                      <div className="flex justify-center pt-8">
                        <div className="relative">
                          <div className="p-1 bg-gradient-to-br from-[#E57A44] to-[#F7C35F] rounded-full group-hover:scale-105 transition-transform duration-500">
                            <div className="p-0.5 bg-white rounded-full">
                              <img
                                src={chef.photo || "https://cdn-icons-png.flaticon.com/512/1721/1721307.png"}
                                alt={chef.name}
                                className="w-24 h-24 rounded-full object-cover"
                                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/1721/1721307.png"; }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 text-center">
                        <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-3" />
                        <h3
                          className="text-lg font-bold text-[#6B3A1E] group-hover:text-[#E57A44] transition-colors mb-1"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {chef.name}
                        </h3>
                        <p className="text-xs text-[#E57A44] font-semibold mb-2 line-clamp-1">
                          {chef.cuisine?.join(", ") || "Home Chef"}
                        </p>
                        <div className="flex justify-center mb-3">
                          <StarRow rating={stats.avg} count={stats.count} />
                        </div>
                        <p className="text-xs text-[#6B3A1E]/70 line-clamp-2 mb-4 min-h-[2rem]">
                          {chef.bio || "Passionate about authentic homemade food."}
                        </p>

                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => setSelectedChef(chef)}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-2.5 rounded-xl border-2 border-[#E57A44]/40 text-[#6B3A1E] font-semibold text-xs hover:border-[#E57A44] hover:bg-orange-50 transition"
                          >
                            View Profile
                          </motion.button>
                          <motion.button
                            onClick={() => navigate("/meals")}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold text-xs shadow hover:shadow-md transition"
                          >
                            Order
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Allchef;