// ✅ Read-only ChefReview.jsx (No create, edit, delete)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useChef } from '../Context/ChefContext.jsx';

const API = import.meta.env.VITE_API_URL;

const ChefReview = () => {
  const { chef } = useChef();
  const chefId = chef?._id;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/reviews/chef/${chefId}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chefId) fetchReviews();
  }, [chefId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.h2
        className="text-4xl font-bold text-center mb-8"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        ⭐ Reviews for Your Dishes
      </motion.h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-gray-500">No reviews found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-indigo-50 text-left text-sm text-indigo-700">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {reviews.map((review) => (
                  <motion.tr
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border-t text-sm hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">{review.userId?.name || 'User'}</td>
                    <td className="px-4 py-3 text-gray-600">{review.orderId?._id || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{review.comment || <em>No comment</em>}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <FaStar
                            key={i}
                            className={`h-4 w-4 ${i <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChefReview;
