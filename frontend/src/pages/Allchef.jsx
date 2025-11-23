import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";
import Loading from '../Loading.jsx';

const getRandomRating = () => (Math.random() * 1.4 + 3.6).toFixed(1);

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const StarRow = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const total = 5;

  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < full;
        const showHalf = !filled && i === full && half;
        return (
          <FaStar
            key={i}
            className={
              filled
                ? "text-[#F7C35F]"
                : showHalf
                ? "text-[#F7C35F] opacity-60"
                : "text-gray-300"
            }
            size={16}
          />
        );
      })}
      <span className="ml-1.5 text-sm font-bold text-[#6B3A1E]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const Allchef = () => {
  const [loadingState, setLoading] = useState(true);
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chefs/getAllChefs`, {
          method: "GET",
          credentials: "include",
        });
        
        if (!res.ok) throw new Error("Failed to fetch chefs");
        
        const data = await res.json();
        const updated = data.map((chef) => ({
          ...chef,
          rating: parseFloat(getRandomRating()),
        }));
        
        setChefs(updated);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setChefs([]);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchChefs();
  }, []);

  if (loadingState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-white/80 max-w-md"
        >
          <span className="text-6xl mb-4 block">⚠️</span>
          <p className="text-[#E57A44] text-xl sm:text-2xl font-bold mb-3">Error loading chefs</p>
          <p className="text-[#6B3A1E]/70 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (chefs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-white/80"
        >
          <span className="text-6xl mb-4 block">👨‍🍳</span>
          <p className="text-[#6B3A1E] text-xl font-semibold">No chefs available at the moment</p>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] min-h-screen py-12 sm:py-16 md:py-20 px-4 overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-[#F7C35F] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#E57A44] rounded-full blur-3xl opacity-15 pointer-events-none"></div>

      {/* Floating Food Icons */}
      <motion.div
        className="absolute w-12 sm:w-16 top-20 left-8 opacity-20 filter drop-shadow-lg pointer-events-none"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-5xl sm:text-6xl">👨‍🍳</span>
      </motion.div>

      <motion.div
        className="absolute w-12 sm:w-16 bottom-32 right-10 opacity-20 filter drop-shadow-lg pointer-events-none"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-5xl sm:text-6xl">🍳</span>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#6B3A1E] mb-3 sm:mb-4"
            style={{ 
              fontFamily: "Georgia, serif",
              textShadow: "0 2px 20px rgba(247, 195, 95, 0.3)"
            }}
          >
            Meet Our Master Chefs 👨‍🍳
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-3"></div>
          <p className="text-[#6B3A1E]/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
            Passionate home chefs bringing authentic flavors to your table
          </p>
        </motion.div>

        {/* Chef Detail Modal */}
        <AnimatePresence>
          {selectedChef && (
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
                className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-[#E57A44]/30 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedChef(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                >
                  <FaTimes className="text-xl text-[#6B3A1E]" />
                </button>

                {/* Header Section */}
                <div className="relative bg-gradient-to-br from-[#E57A44] to-[#F7C35F] p-8 sm:p-10 rounded-t-3xl">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Chef Image with Ring */}
                    <div className="inline-block p-1 bg-white rounded-full mb-4">
                      <div className="p-1 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-full">
                        <img
                          src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                          alt={selectedChef.name}
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                      </div>
                    </div>

                    <h3 
                      className="text-2xl sm:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "Georgia, serif", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                    >
                      {selectedChef.name}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2 text-white/90 mb-2">
                      <FaMapMarkerAlt />
                      <span className="text-sm sm:text-base font-medium">{selectedChef.location?.area || "Location not available"}</span>
                    </div>

                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <StarRow rating={selectedChef.rating} />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8">
                  {/* Cuisine Tags */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FaUtensils className="text-[#E57A44] text-lg" />
                      <h4 className="text-base sm:text-lg font-bold text-[#6B3A1E]">Specialties</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(selectedChef.cuisine || ["Not specified"]).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#E57A44]/20 to-[#F7C35F]/20 text-[#6B3A1E] rounded-full text-xs sm:text-sm font-semibold border border-[#E57A44]/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#E57A44]/30 to-transparent my-6"></div>

                  {/* Contact Info */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#FFF7EB] rounded-xl p-4 border border-[#E57A44]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#E57A44] to-[#F7C35F] rounded-full flex items-center justify-center flex-shrink-0">
                          <FaPhone className="text-white text-sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-[#6B3A1E]/60 font-semibold mb-0.5">Phone</p>
                          <p className="text-sm text-[#6B3A1E] font-medium truncate">{selectedChef.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FFF7EB] rounded-xl p-4 border border-[#E57A44]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#E57A44] to-[#F7C35F] rounded-full flex items-center justify-center flex-shrink-0">
                          <FaEnvelope className="text-white text-sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-[#6B3A1E]/60 font-semibold mb-0.5">Email</p>
                          <p className="text-sm text-[#6B3A1E] font-medium truncate">{selectedChef.email || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-[#FFF7EB] rounded-xl p-5 border border-[#E57A44]/20">
                    <h4 className="text-base sm:text-lg font-bold text-[#6B3A1E] mb-3 flex items-center gap-2">
                      <span>📖</span> About the Chef
                    </h4>
                    <p className="text-sm sm:text-base text-[#6B3A1E]/80 leading-relaxed">
                      {selectedChef.bio || "A passionate chef dedicated to creating delicious homemade meals with love and care."}
                    </p>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => setSelectedChef(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full py-3 sm:py-4 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group text-sm sm:text-base"
                  >
                    <span className="relative z-10">Close</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chefs Grid */}
        {!selectedChef && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {chefs.map((chef) => (
              <motion.div
                key={chef._id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>

                {/* Card */}
                <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-white/80">
                  {/* Badge */}
                  <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md uppercase tracking-wide">
                    ⭐ Top Chef
                  </span>

                  {/* Chef Image */}
                  <div className="w-full flex justify-center pt-8 sm:pt-10">
                    <div className="p-1 bg-gradient-to-br from-[#E57A44] to-[#F7C35F] rounded-full group-hover:scale-110 transition-transform duration-500">
                      <div className="p-0.5 bg-white rounded-full">
                        <img
                          src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                          alt={chef.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 text-center">
                    {/* Decorative Border */}
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-3"></div>

                    <h3 
                      className="text-lg sm:text-xl font-bold text-[#6B3A1E] group-hover:text-[#E57A44] transition-colors mb-2"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {chef.name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-[#E57A44] font-semibold mb-2 line-clamp-1">
                      {chef.cuisine?.join(", ") || "Cuisine not listed"}
                    </p>

                    <div className="mb-3">
                      <StarRow rating={chef.rating} />
                    </div>

                    <p className="text-xs sm:text-sm text-[#6B3A1E]/70 min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2 mb-4">
                      {chef.bio || "A passionate chef creating delicious homemade meals."}
                    </p>

                    <motion.button
                      onClick={() => setSelectedChef(chef)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group/btn text-sm sm:text-base"
                    >
                      <span className="relative z-10">View Profile</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </motion.button>
                  </div>

                  {/* Hover Overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#F7C35F]/10 to-transparent" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Allchef;