// ChefReviews.jsx — Production Ready (Card layout instead of ugly table)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useChef } from "../Context/ChefContext.jsx";

const API = import.meta.env.VITE_API_URL;

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i =>
      i <= rating
        ? <FaStar key={i} className="text-yellow-400 text-sm" />
        : <FaRegStar key={i} className="text-gray-300 text-sm" />
    )}
  </div>
);

const ChefReviews = () => {
  const { chef } = useChef();
  const chefId = chef?._id;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chefId) return;
    axios.get(`${API}/reviews/chef/${chefId}`)
      .then(r => setReviews(Array.isArray(r.data) ? r.data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [chefId]);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">⭐ Customer Reviews</h2>
        {avg && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-2xl">
            <FaStar className="text-yellow-400 text-xl" />
            <span className="text-2xl font-extrabold text-yellow-600">{avg}</span>
            <span className="text-sm text-gray-500">/ 5 ({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">⭐</div>
          <p className="font-semibold text-lg">No reviews yet</p>
          <p className="text-sm mt-1">Deliver great food to get your first review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, i) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {(review.userId?.fullName || review.userId?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {review.userId?.fullName || review.userId?.email || "Customer"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRow rating={review.rating} />
                </div>

                {review.comment && (
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed border-l-2 border-orange-200 pl-3">
                    "{review.comment}"
                  </p>
                )}

                {review.orderId && (
                  <p className="mt-2 text-xs text-gray-400">
                    Order: #{(review.orderId?._id || review.orderId).toString().slice(-8)}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ChefReviews;
