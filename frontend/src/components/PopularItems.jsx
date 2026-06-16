// PopularItems.jsx — Rewritten: no inline styles, skeleton loader, MealCard, LoginGateModal
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useUser } from "../context/userContext";
import MealCard from "./MealCard.jsx";
import LoginGateModal from "./LoginGateModal.jsx";

function PopularItems() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals/`);
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.meals)
          ? raw.meals
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        setMeals(list.filter((m) => m.isActive !== false));
      } catch {
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleOrder = (mealId) => {
    if (!user) {
      setLoginOpen(true);
    } else {
      navigate(`/order-now/${mealId}`);
    }
  };

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [meals]);

  const scroll = (dir) => {
    sliderRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="relative py-12 overflow-hidden bg-white">
      {/* Ambient glow */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="section-badge">⭐ Most Loved</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Popular Items</h2>
            <p className="text-gray-500 text-sm mt-1">Ordered most by our customers this week</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 transition-all"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 transition-all"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* Slider */}
        {loading ? (
          /* Skeleton Loader */
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-56 sm:w-60">
                <div className="skeleton rounded-2xl h-36 sm:h-40 mb-3" />
                <div className="skeleton h-4 rounded mb-2 w-3/4" />
                <div className="skeleton h-3 rounded mb-2 w-1/2" />
                <div className="skeleton h-8 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <p className="text-gray-500 font-medium">No meals available right now.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <>
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scrollbar-hidden pb-4"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {meals.slice(0, 10).map((meal, i) => (
                <MealCard
                  key={meal._id}
                  meal={meal}
                  index={i}
                  variant="slider"
                  onOrder={handleOrder}
                />
              ))}

              {/* View All CTA card */}
              <div
                className="flex-shrink-0 w-40 flex items-center justify-center"
                style={{ scrollSnapAlign: "start" }}
              >
                <button
                  onClick={() => navigate("/meals")}
                  className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-orange-200 hover:border-orange-400 text-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all group w-full"
                >
                  <FaArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                  <span className="text-xs font-bold text-center">View All Meals</span>
                </button>
              </div>
            </div>

            {/* Mobile: View All button */}
            <div className="mt-6 text-center sm:hidden">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/meals")}
                className="btn btn-primary btn-lg flex items-center gap-2 mx-auto"
              >
                View All Meals <FaArrowRight className="text-sm" />
              </motion.button>
            </div>
          </>
        )}
      </div>

      {/* Login Gate Modal */}
      <LoginGateModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        redirectTo={window.location.pathname}
      />
    </section>
  );
}

export default PopularItems;