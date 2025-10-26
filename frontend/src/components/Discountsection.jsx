import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx"; // ✅ Make sure this exists

const DiscountSection = () => {
  const [discountedMeals, setDiscountedMeals] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscountedMeals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals/discounted`);
        const mealsWithTime = res.data.map((meal) => ({
          ...meal,
          timeLeft: calculateTimeLeft(meal.discountStartDate, meal.discountDuration),
        }));
        setDiscountedMeals(mealsWithTime);
      } catch (err) {
        console.error("Error fetching discounted meals:", err);
      }
    };

    fetchDiscountedMeals();

    const interval = setInterval(() => {
      setDiscountedMeals((prevMeals) =>
        prevMeals.map((meal) => ({
          ...meal,
          timeLeft: calculateTimeLeft(meal.discountStartDate, meal.discountDuration),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateTimeLeft = (startDate, duration) => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + parseInt(duration));
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    return `${days}d ${hours}:${minutes}:${seconds}`;
  };

  const getDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  const handleClick = (meal) => {
    const discountedPrice = getDiscountedPrice(meal.price, meal.discount);

    if (!user) {
      setSelectedMeal({ ...meal, discountedPrice });
      setShowLoginModal(true);
    } else {
      navigate("/cart", { state: { meal: { ...meal, discountedPrice } } });
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gradient-to-b from-yellow-100 via-orange-50 to-orange-200 rounded-xl shadow-lg my-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-700 text-center">🔥 Discounted Meals</h2>

      {discountedMeals.length === 0 ? (
        <p className="text-gray-600 text-center">No discounted meals available now.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {discountedMeals.map((meal) => {
            const discountedPrice = getDiscountedPrice(meal.price, meal.discount);
            return (
              <div
                key={meal._id}
                onClick={() => handleClick(meal)}
                className="relative bg-white border rounded-xl shadow-md hover:scale-105 transition duration-300 p-2 cursor-pointer"
              >
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
                  {meal.discount}% OFF
                </div>
                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  {meal.timeLeft}
                </div>

                <img
                  src={meal.photo}
                  alt={meal.title}
                  className="w-full h-28 object-cover rounded-lg mb-2 shadow"
                />
                <h3 className="text-sm font-semibold text-orange-800 mb-1 truncate">{meal.title}</h3>
                <p className="text-gray-600 text-xs mb-1 line-clamp-2">{meal.description}</p>

                <div className="text-sm">
                  <span className="text-gray-400 line-through mr-1">₹{meal.price}</span>
                  <span className="text-orange-700 font-bold">₹{discountedPrice}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-3 text-orange-800">Login Required</h3>
            <p className="text-sm text-gray-600 mb-5">
              Please login to place your order for <strong>{selectedMeal?.title}</strong>.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginRedirect}
                className="px-4 py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
