// GalleryPage.jsx — Production Ready with TopNav + real meals from API
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import TopNav from "../components/TopNav.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const BASE = import.meta.env.VITE_API_URL;

// Fallback curated images for polaroid effect
const FALLBACK = [
  { src: "https://www.ruchiskitchen.com/wp-content/uploads/2020/12/Paneer-butter-masala-recipe-3-500x500.jpg", name: "Paneer Butter Masala", badge: "Signature", note: "Rich & Creamy" },
  { src: "https://t4.ftcdn.net/jpg/01/15/48/41/360_F_115484118_OFxvDHelhwIRAkNhXIfCZS6Py0eUyWJD.jpg", name: "Special Thali", badge: "Complete Meal", note: "Balanced & Hearty" },
  { src: "https://vegecravings.com/wp-content/uploads/2016/07/veg-pulao-recipe-step-by-step-instructions.jpg", name: "Veg Pulao", badge: "Home Style", note: "Aromatic & Light" },
  { src: "https://tastedilli6.com/cdn/shop/files/Dal-fry-restaurant-style.jpg?v=1685532226", name: "Dal Fry & Rice", badge: "Comfort Food", note: "Soul Warming" },
];

const GalleryPage = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    axios.get(`${BASE}/meals`)
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : r.data?.meals || [];
        setMeals(data);
      })
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, []);

  const displayItems = meals.length > 0 ? meals : FALLBACK;
  const cuisines = ["All", ...new Set(meals.map(m => m.category).filter(Boolean))];
  const filtered = activeFilter === "All"
    ? displayItems
    : displayItems.filter(m => m.category === activeFilter);

  const toggleLike = (id) => setLiked(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-[#FFF8ED] to-[#FFEFD5]">
      <TopNav onLoginClick={() => navigate("/login")} onSignupClick={() => navigate("/signup")} />

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
            Our Kitchen Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#5C4033]">
            Handcrafted with <span className="text-orange-500">Love</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
            Every meal is prepared by home chefs using fresh ingredients, delivered straight to your doorstep.
          </p>
          <button
            onClick={() => navigate("/meals")}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            Order Now →
          </button>
        </motion.div>
      </section>

      {/* Filters */}
      {cuisines.length > 1 && (
        <div className="flex gap-2 flex-wrap justify-center px-4 pb-8">
          {cuisines.map(c => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                activeFilter === c
                  ? "bg-orange-500 text-white border-orange-500 shadow"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <section className="px-4 sm:px-6 pb-24 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filtered.map((item, i) => {
                const id = item._id || i;
                const isApiMeal = !!item._id;
                const src = item.photo || item.src;
                const name = item.title || item.name;
                const badge = item.category || item.badge || "Chef's Pick";
                const note = item.description || item.note || "";
                const price = item.price;

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group cursor-pointer"
                    style={{
                      transform: i % 3 === 0 ? "rotate(-1.5deg)" : i % 3 === 1 ? "rotate(1.5deg)" : "rotate(-0.5deg)",
                    }}
                    onClick={() => isApiMeal && navigate(`/order-now/${item._id}`)}
                  >
                    {/* Polaroid Card */}
                    <div className="relative bg-white p-4 pb-16 rounded-2xl shadow-[0_8px_30px_rgba(92,64,51,0.1)] group-hover:shadow-[0_16px_50px_rgba(92,64,51,0.18)] group-hover:-translate-y-3 group-hover:rotate-0 group-hover:scale-[1.02] transition-all duration-300">
                      {/* Tape */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-7 bg-[#F4D9A6]/70 rounded shadow-sm border-l border-r border-[#E8C18F]/50" />

                      {/* Image */}
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-[#F4EDE3]">
                        <img
                          src={src}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ filter: "contrast(1.08) saturate(1.15) brightness(1.02)" }}
                          onError={e => { e.target.src = "https://via.placeholder.com/300x200?text=Food"; }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badge */}
                        <div className="absolute top-2.5 left-2.5 bg-white/95 px-2.5 py-1 rounded-full shadow text-xs font-bold text-orange-600 border border-orange-100">
                          {badge}
                        </div>

                        {/* Like Button */}
                        <button
                          onClick={e => { e.stopPropagation(); toggleLike(id); }}
                          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition hover:scale-110"
                        >
                          <FaHeart className={liked[id] ? "text-red-500" : "text-gray-300"} />
                        </button>

                        {/* Order button on hover */}
                        {isApiMeal && (
                          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                              <FaShoppingCart /> Order Now
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Caption */}
                      <div className="text-center mt-3 px-1">
                        <h3 className="text-[#5C4033] font-serif font-bold text-base group-hover:text-orange-600 transition">
                          {name}
                        </h3>
                        {price && (
                          <p className="text-orange-500 font-extrabold text-lg mt-0.5">₹{price}</p>
                        )}
                        <p className="text-gray-400 text-xs italic mt-1 line-clamp-1">{note}</p>
                        <div className="flex justify-center gap-1 mt-2">
                          {[...Array(5)].map((_, idx) => (
                            <FaStar key={idx} className="text-[#E8B55F] text-xs" />
                          ))}
                        </div>
                      </div>

                      {/* Page curl */}
                      <div
                        className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-[#F4EDE3] to-white/50 rounded-tl-3xl opacity-60"
                        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default GalleryPage;