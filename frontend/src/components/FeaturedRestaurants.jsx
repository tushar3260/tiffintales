import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const getRandomRating = () => (Math.random() * 1.4 + 3.6).toFixed(1); // 3.6–5.0

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
                ? "text-yellow-400"
                : showHalf
                ? "text-yellow-300 opacity-70"
                : "text-gray-300"
            }
            size={14}
          />
        );
      })}
      <span className="ml-1 text-xs font-semibold text-gray-700">{rating}</span>
    </div>
  );
};

const FeaturedRestaurants = () => {
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chefs/getAllChefs`);
        const data = await res.json();
        const updatedChefs = data.slice(0, 8).map((chef) => ({
          ...chef,
          rating: parseFloat(getRandomRating()),
        }));
        setChefs(updatedChefs);
      } catch (err) {
        console.error("Failed to fetch chefs:", err);
      }
    };

    fetchChefs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-[#fffaf1]">
      <h2 className="text-4xl font-bold text-orange-600 mb-12 text-center">Featured Chefs</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {chefs.map((chef, index) => (
          <div
            key={index}
            className="group relative flex flex-col justify-between rounded-2xl bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden hover:scale-[1.03] border border-yellow-200 hover:border-transparent"
          >
            <span className="absolute top-3 left-3 z-10 bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm uppercase tracking-wide">
              Best Choice
            </span>
            <div className="w-full flex justify-center pt-6">
              <div className="bg-gradient-to-tr from-orange-500 via-orange-400 to-amber-300 p-[2px] rounded-full">
                <img
                  src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                  alt={chef.name}
                  className="w-24 h-24 rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="flex-grow p-6 pb-7 text-center flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                {chef.name}
              </h3>
              <p className="text-sm text-orange-600 font-medium mt-0.5">
                {chef.cuisine?.join(", ") || "Cuisine not listed"}
              </p>
              <div className="mt-2">
                <StarRow rating={chef.rating} />
              </div>
              <p className="text-gray-600 text-sm mt-3 min-h-[2.5rem]">
                {chef.bio?.slice(0, 70) || "No bio available."}
              </p>
              <div className="flex-grow" />
              <button
                onClick={() => setSelectedChef(chef)}
                className="mt-5 w-full py-2 rounded-lg font-semibold text-white bg-[#ff7e00] hover:bg-orange-600 active:scale-95 transition-all shadow-md"
              >
                View Detail
              </button>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/20 to-transparent" />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate("/allchef")}
          className="bg-orange-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-orange-500 transition duration-300 flex items-center gap-2"
        >
          View All Chefs
          <svg
            className="w-4 h-4 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Modal Popup */}
      {selectedChef && (
        <div className="fixed inset-0 bg-[#FFFAF1] py-16 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[95%] max-w-xl relative">
            <button
              onClick={() => setSelectedChef(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
            >
              &times;
            </button>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-28 h-28 rounded-full border-4 border-orange-400 overflow-hidden mb-4">
                <img
                  src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                  alt={selectedChef.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & Location */}
              <h2 className="text-2xl font-bold text-gray-800">{selectedChef.name}</h2>
              <p className="text-gray-500 text-sm">{selectedChef.location?.area || "N/A"}</p>

              {/* Cuisine */}
              <p className="text-orange-600 font-semibold mt-1 capitalize">
                {selectedChef.cuisine?.join(", ") || "Cuisine not listed"}
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 items-center text-gray-700 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-pink-600">📞</span>
                <span>{selectedChef.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">📧</span>
                <span>{selectedChef.email || "N/A"}</span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-700 mb-1">Bio</h3>
              <p className="text-gray-600 text-sm">
                {selectedChef.bio || "No description available."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedRestaurants;
