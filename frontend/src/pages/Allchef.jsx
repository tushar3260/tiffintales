import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Loading from '../Loading.jsx'


const getRandomRating = () => (Math.random() * 1.4 + 3.6).toFixed(1); // 3.6–5.0

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
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
                ? "text-yellow-400"
                : showHalf
                ? "text-yellow-300 opacity-70"
                : "text-gray-300"
            }
            size={14}
          />
        );
      })}
      <span className="ml-1 text-xs font-semibold text-gray-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const Allchef = () => {
  const [LoadingState, setLoading] = useState(true);
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    fetch(`${import.meta.env.VITE_API_URL}/chefs/getAllChefs`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chefs");
        return res.json();
      })
      .then((data) => {
        const updated = data.map((chef) => ({
          ...chef,
          rating: parseFloat(getRandomRating()),
        }));
        setChefs(updated);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setChefs([]);
      });
  }, []);

  if (LoadingState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffaf1]">
        <Loading />
      </div>
    );
  }

  return (
    <section className="bg-[#fffaf1] min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-orange-600 mb-12">Our Chefs</h2>

        {selectedChef ? (
          // ...rest of your code remains the same for selectedChef...
          <div className="group bg-white px-8 py-10 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 w-full max-w-xl mx-auto text-center relative">
            {/* ...profile and detail view... */}
            {/* ...no changes here... */}
            <img
              src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
              alt={selectedChef.name}
              className="w-28 h-28 rounded-full mx-auto mb-5 object-cover border-4 border-orange-300 shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-all duration-200">
              {selectedChef.name}
            </h3>
            <p className="text-base text-gray-500 mt-1">{selectedChef.location?.area || "N/A"}</p>
            <p className="text-lg text-orange-600 font-semibold mt-1">
              {selectedChef.cuisine?.join(", ") || "Cuisine not listed"}
            </p>
            <hr className="my-6 border-t border-gray-200" />
            <div className="flex justify-center gap-16 text-base text-gray-700 mb-6 px-2">
              <div className="flex items-center gap-2 hover:text-orange-600 transition-colors duration-200 cursor-pointer">
                <span>📞</span>
                <span>{selectedChef.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 hover:text-orange-600 transition-colors duration-200 cursor-pointer">
                <span>📧</span>
                <span>{selectedChef.email || "N/A"}</span>
              </div>
            </div>
            <div className="text-left max-w-xl mx-auto px-2">
              <p className="font-bold text-lg text-gray-700 mb-2">Bio</p>
              <p className="text-base text-gray-600">{selectedChef.bio || "No description available."}</p>
            </div>
            <button
              onClick={() => setSelectedChef(null)}
              className="mt-8 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md transition-all"
            >
              Back to All Chefs
            </button>
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {chefs.map((chef) => {
              const ringClass =
                "bg-gradient-to-tr from-orange-500 via-orange-400 to-amber-300 p-[2px] rounded-full";

              return (
                <motion.div
                  key={chef._id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex flex-col justify-between rounded-2xl bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <span className="absolute top-3 left-3 z-10 bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm uppercase tracking-wide">
                    Best Choice
                  </span>
                  <div className="w-full flex justify-center pt-6">
                    <div className={ringClass}>
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
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Allchef;
