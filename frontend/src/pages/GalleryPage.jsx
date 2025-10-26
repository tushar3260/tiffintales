import React from "react";
import { motion } from "framer-motion";

// ================== IMAGE ARRAY ==================
const foodImages = [
  {
    src: "https://www.ruchiskitchen.com/wp-content/uploads/2020/12/Paneer-butter-masala-recipe-3-500x500.jpg", // Yaha Matar Paneer ki image bhi laga sakte ho
  },
  {
    src: "https://t4.ftcdn.net/jpg/01/15/48/41/360_F_115484118_OFxvDHelhwIRAkNhXIfCZS6Py0eUyWJD.jpg",
    name: "Special Thali",
  },
  {
    src: "https://vegecravings.com/wp-content/uploads/2016/07/veg-pulao-recipe-step-by-step-instructions.jpg",
    name: "Veg Pulao",
  },
  {
    src: "https://i.ytimg.com/vi/_borBb4g8LA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDI81swXgTev6_B75-pLQ6XMKcUZw",
    name: "Homestyle Roti",
  },
  {
    src: "https://tastedilli6.com/cdn/shop/files/Dal-fry-restaurant-style.jpg?v=1685532226",
    name: "Dal Fry & Rice",
  },
  {
    src: "https://img.freepik.com/premium-photo/salad-tomatoes-cucumber-red-onions-lettuce-leaves_2829-1732.jpg?semt=ais_hybrid&w=740",
    name: "Healthy Salad",
  },
  {
    src: "https://t3.ftcdn.net/jpg/07/11/92/84/360_F_711928491_Am9rJkePY5UaeAZKSZQ9tFkWweUWVfSF.jpg",
    name: "Butter Naan",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1tJTGY_7Vq5tl8h_z7R18Dx4lioKVCHr7ug&s",
    name: "Chef's Special Combo",
  },
];


const GalleryPage = () => {
  return (
    <div className="relative bg-gradient-to-b from-orange-50 to-white min-h-screen font-sans overflow-hidden">
      {/* ================== FLOATING DOODLES ================== */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
        className="absolute w-14 top-20 left-10 opacity-30"
        animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/3082/3082031.png"
        className="absolute w-16 bottom-24 right-12 opacity-30"
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* ================== PARALLAX HERO ================== */}
      <div
        className="relative h-[320px] bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/f5a2c44e-f2dd-4f14-803e-75316a6d1502.png')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
          {/* Steam Animation */}
          <div className="steam-container mb-2">
            <span className="steam"></span>
            <span className="steam"></span>
            <span className="steam"></span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg font-[cursive]"
          >
            Maa ke Haath ka Swad ❤️
          </motion.h1>
          <p className="text-white mt-2 italic">Ghar ka pyaar, ek thali mein.</p>
        </div>
      </div>

      {/* ================== MASONRY GRID ================== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          {foodImages.map((food, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-2xl group shadow-md border-2 border-transparent hover:border-orange-400 hover:shadow-2xl"
              whileHover={{ scale: 1.04 }}
            >
              {/* IMAGE */}
              <img
                src={food.src}
                alt={food.name}
                className="w-full object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-110"
              />
              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <p className="text-white text-lg font-semibold backdrop-blur-sm px-3 py-1 rounded-lg font-[cursive]">
                  {food.name}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================== PARALLAX FOOTER ================== */}
      <div
        className="relative h-[220px] bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/2833abff-173c-483d-b197-c3c45e1ebe9b.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl font-bold text-white font-[cursive]"
          >
            Swad Jo Maa Ki Yaad Dilaye
          </motion.h2>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
