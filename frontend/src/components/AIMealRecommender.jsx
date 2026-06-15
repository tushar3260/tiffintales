// AIMealRecommender.jsx — Floating AI-powered meal suggestion panel
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTimes, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdRestaurantMenu } from "react-icons/md";

// ── Mood config ─────────────────────────────────────────────────
const MOODS = [
  { id: "healthy",  emoji: "🥗", label: "Healthy",   tags: ["Veg", "Salad", "Light"],   weight: { rating: 2, discount: 0.5, price: -0.3 } },
  { id: "comfort",  emoji: "🍛", label: "Comfort",   tags: ["Comfort", "Dal", "Paneer"], weight: { rating: 1.5, discount: 1, price: 0 } },
  { id: "quick",    emoji: "⚡", label: "Quick",     tags: ["Quick", "Snack", "Light"],  weight: { rating: 1, discount: 0.5, price: -1 } },
  { id: "protein",  emoji: "💪", label: "Protein",   tags: ["Protein", "Egg", "Chicken"],weight: { rating: 2, discount: 0.5, price: 0 } },
  { id: "festive",  emoji: "🎉", label: "Festive",   tags: ["Biryani", "Special"],       weight: { rating: 3, discount: 0.5, price: 0.5 } },
  { id: "budget",   emoji: "💰", label: "Budget",    tags: ["Veg", "Dal"],               weight: { rating: 1, discount: 2, price: -2 } },
];

const TIMES = [
  { id: "lunch",   emoji: "🌞", label: "Lunch" },
  { id: "dinner",  emoji: "🌙", label: "Dinner" },
  { id: "anytime", emoji: "🕐", label: "Anytime" },
];

// ── Scoring algorithm ───────────────────────────────────────────
function scoreMeal(meal, mood, timeId) {
  if (!mood) return 0;

  const w = mood.weight;
  let score = 0;

  // Rating score (0–5 → 0–10 points)
  score += (meal.rating || 3.5) * w.rating;

  // Discount score
  score += (meal.discount || 0) * w.discount;

  // Price inversion (cheaper = better when budget mood)
  const normalizedPrice = Math.max(0, (500 - (meal.price || 200)) / 500);
  score += normalizedPrice * (w.price < 0 ? Math.abs(w.price) * 5 : 0);

  // Tag matching bonus
  const mealTagsLower = (meal.tags || []).map((t) => t.toLowerCase());
  const moodTagsLower = mood.tags.map((t) => t.toLowerCase());
  const tagMatches = moodTagsLower.filter((t) =>
    mealTagsLower.some((mt) => mt.includes(t) || t.includes(mt))
  ).length;
  score += tagMatches * 3;

  // Title matching bonus
  const titleLower = (meal.title || "").toLowerCase();
  const titleMatches = moodTagsLower.filter((t) => titleLower.includes(t)).length;
  score += titleMatches * 2;

  // Time slot matching
  if (timeId !== "anytime") {
    const slots = (meal.timeSlots || []).map((s) => s.toLowerCase());
    if (slots.includes(timeId)) score += 4;
    else if (slots.length > 0) score -= 1;
  }

  // Active boost
  if (meal.isActive) score += 2;

  // Slight randomness so results feel fresh each time
  score += Math.random() * 0.8;

  return score;
}

// ── Recommendation Card ─────────────────────────────────────────
function RecoCard({ meal, rank, onOrder }) {
  const discounted = meal.discount > 0
    ? Math.round(meal.price * (1 - meal.discount / 100))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.12 }}
      className="relative flex gap-3 bg-white rounded-2xl p-3 border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group cursor-pointer"
      onClick={onOrder}
    >
      {/* Rank badge */}
      <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-md ${
        rank === 0 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" :
        rank === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" :
        "bg-gradient-to-br from-orange-300 to-amber-500 text-white"
      }`}>
        {rank === 0 ? "🥇" : rank === 1 ? "🥈" : "🥉"}
      </div>

      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={meal.photo || "https://placehold.co/200x200/FFF7ED/EA580C?text=🍽️"}
          alt={meal.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm line-clamp-1">{meal.title}</p>
        <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
          <FaMapMarkerAlt className="text-orange-400 text-[9px]" />
          <span className="truncate">{meal.chefId?.name || "Home Chef"}</span>
        </div>
        {meal.rating > 0 && (
          <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
            <FaStar className="text-[9px]" />
            <span>{meal.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-orange-600 font-black text-sm">₹{discounted || meal.price}</span>
            {discounted && <span className="text-gray-400 text-[10px] line-through">₹{meal.price}</span>}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onOrder(); }}
            className="text-[10px] font-bold px-2.5 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow hover:shadow-md"
          >
            Order Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function AIMealRecommender() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("mood"); // mood | time | results
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [computing, setComputing] = useState(false);

  // Pre-fetch meals once
  useEffect(() => {
    setLoadingMeals(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/meals`)
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.meals) ? raw.meals : [];
        setAllMeals(list.filter((m) => m.isActive !== false));
      })
      .catch(() => {})
      .finally(() => setLoadingMeals(false));
  }, []);

  const computeRecs = useCallback((mood, timeId) => {
    setComputing(true);
    setTimeout(() => {
      const scored = allMeals
        .map((m) => ({ ...m, _score: scoreMeal(m, mood, timeId) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 3);
      setRecommendations(scored);
      setComputing(false);
    }, 800); // small delay for UX dramatics
  }, [allMeals]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setStep("time");
  };

  const handleTimeSelect = (t) => {
    setSelectedTime(t);
    setStep("results");
    computeRecs(selectedMood, t.id);
  };

  const reset = () => {
    setStep("mood");
    setSelectedMood(null);
    setSelectedTime(null);
    setRecommendations([]);
  };

  const close = () => { setIsOpen(false); setTimeout(reset, 300); };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 w-14 h-14 rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-0.5 text-white"
        style={{ background: "linear-gradient(135deg, #7C3AED, #DB2777)" }}
        title="AI Meal Recommender"
        aria-label="Open AI Meal Recommender"
      >
        <HiSparkles className="text-xl" />
        <span className="text-[8px] font-bold leading-none">AI Chef</span>
      </motion.button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Slide-up panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[380px] z-50 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div
                className="p-5 pb-4 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #7C3AED, #DB2777)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <HiSparkles className="text-white text-xl" />
                      <span className="text-white font-black text-lg">AI Chef</span>
                      <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">BETA</span>
                    </div>
                    <p className="text-white/80 text-xs">
                      {step === "mood" && "Tell me your mood — I'll find the perfect meal"}
                      {step === "time" && `${selectedMood?.emoji} Great! When are you eating?`}
                      {step === "results" && `${selectedMood?.emoji} Your personalized picks are ready!`}
                    </p>
                  </div>
                  <button
                    onClick={close}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>

                {/* Step indicator */}
                <div className="flex gap-1.5 mt-3">
                  {["mood", "time", "results"].map((s, i) => (
                    <div
                      key={s}
                      className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                        step === s || (i === 0 && step !== "mood") || (i === 1 && step === "results")
                          ? "bg-white"
                          : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                  {/* Step 1: Mood selection */}
                  {step === "mood" && (
                    <motion.div
                      key="mood"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <p className="text-gray-700 font-bold text-sm mb-3">How are you feeling?</p>
                      <div className="grid grid-cols-3 gap-2">
                        {MOODS.map((m) => (
                          <motion.button
                            key={m.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMoodSelect(m)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                          >
                            <span className="text-2xl">{m.emoji}</span>
                            <span className="text-xs font-semibold text-gray-600 group-hover:text-purple-600">{m.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Time selection */}
                  {step === "time" && (
                    <motion.div
                      key="time"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #7C3AED22, #DB277722)" }}>
                          {selectedMood?.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{selectedMood?.label} mood</p>
                          <p className="text-gray-500 text-xs">Now, pick your meal time</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {TIMES.map((t) => (
                          <motion.button
                            key={t.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTimeSelect(t)}
                            className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                          >
                            <span className="text-3xl">{t.emoji}</span>
                            <span className="text-xs font-bold text-gray-600 group-hover:text-purple-600">{t.label}</span>
                          </motion.button>
                        ))}
                      </div>
                      <button
                        onClick={() => setStep("mood")}
                        className="mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                      >
                        ← Back
                      </button>
                    </motion.div>
                  )}

                  {/* Step 3: Results */}
                  {step === "results" && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {computing || loadingMeals ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full border-4 border-purple-100 border-t-purple-500 animate-spin" />
                            <MdRestaurantMenu className="absolute inset-0 m-auto text-purple-500 text-xl" />
                          </div>
                          <p className="text-gray-600 font-semibold text-sm">AI is cooking up recommendations...</p>
                          <p className="text-gray-400 text-xs">Analyzing taste profiles & ratings</p>
                        </div>
                      ) : recommendations.length === 0 ? (
                        <div className="text-center py-8">
                          <span className="text-4xl">😔</span>
                          <p className="text-gray-600 font-semibold mt-3">No meals found</p>
                          <p className="text-gray-400 text-xs mt-1">Try a different mood or time</p>
                          <button onClick={reset} className="mt-4 text-purple-500 text-xs font-semibold hover:underline">
                            Try again
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-700 font-bold text-sm">
                              {selectedMood?.emoji} Top picks for {selectedTime?.label}
                            </p>
                            <button onClick={reset} className="text-xs text-purple-500 hover:text-purple-700 font-semibold">
                              Try again
                            </button>
                          </div>
                          <div className="space-y-3">
                            {recommendations.map((meal, i) => (
                              <RecoCard
                                key={meal._id}
                                meal={meal}
                                rank={i}
                                onOrder={() => { close(); navigate(`/order-now/${meal._id}`); }}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => { close(); navigate("/meals"); }}
                            className="mt-4 w-full py-2.5 text-sm font-semibold text-purple-600 border-2 border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all"
                          >
                            Browse All Meals →
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
