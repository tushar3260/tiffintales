import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

function PopularItems() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);

  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals/`);
        setMeals(res.data);
      } catch (err) {
        console.error("Error fetching meals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleOrderNow = (mealId) => {
    if (!user) {
      setSelectedMealId(mealId);
      setShowLoginPopup(true);
    } else {
      navigate(`/order-now/${mealId}`);
    }
  };

  const closePopup = () => {
    setShowLoginPopup(false);
    setSelectedMealId(null);
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="p-10 bg-gradient-to-b from-yellow-100 via-orange-100 to-yellow-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Popular Items</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading meals...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-red-400">No meals found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
            {meals.slice(0, 5).map((item) => (
              <motion.div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={item.photo || "https://placehold.co/600x400?text=No+Image"}
                  alt={item.title}
                  className="rounded-t-xl w-full h-36 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.chefId?.name || "Unknown Chef"}</p>
                  <p className="font-bold mt-2">₹{item.price}</p>
                  <motion.button
                    onClick={() => handleOrderNow(item._id)}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  >
                    Order Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <motion.button
              onClick={() => navigate('/meals')}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-400"
            >
              View All Meals 👉
            </motion.button>
          </div>
        </>
      )}

      {/* Login Modal Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold text-orange-600 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to place your order.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={redirectToLogin}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Go to Login
              </button>
              <button
                onClick={closePopup}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopularItems;
