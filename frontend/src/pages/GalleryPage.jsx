import React from "react";
import { motion } from "framer-motion";

// ================== IMAGE ARRAY ==================
const foodImages = [
  {
    src: "https://www.ruchiskitchen.com/wp-content/uploads/2020/12/Paneer-butter-masala-recipe-3-500x500.jpg",
    name: "Paneer Butter Masala",
    emoji: "🧈",
  },
  {
    src: "https://t4.ftcdn.net/jpg/01/15/48/41/360_F_115484118_OFxvDHelhwIRAkNhXIfCZS6Py0eUyWJD.jpg",
    name: "Special Thali",
    emoji: "🍛",
  },
  {
    src: "https://vegecravings.com/wp-content/uploads/2016/07/veg-pulao-recipe-step-by-step-instructions.jpg",
    name: "Veg Pulao",
    emoji: "🍚",
  },
  {
    src: "https://i.ytimg.com/vi/_borBb4g8LA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDI81swXgTev6_B75-pLQ6XMKcUZw",
    name: "Homestyle Roti",
    emoji: "🫓",
  },
  {
    src: "https://tastedilli6.com/cdn/shop/files/Dal-fry-restaurant-style.jpg?v=1685532226",
    name: "Dal Fry & Rice",
    emoji: "🍲",
  },
  {
    src: "https://img.freepik.com/premium-photo/salad-tomatoes-cucumber-red-onions-lettuce-leaves_2829-1732.jpg?semt=ais_hybrid&w=740",
    name: "Healthy Salad",
    emoji: "🥗",
  },
  {
    src: "https://t3.ftcdn.net/jpg/07/11/92/84/360_F_711928491_Am9rJkePY5UaeAZKSZQ9tFkWweUWVfSF.jpg",
    name: "Butter Naan",
    emoji: "🥖",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1tJTGY_7Vq5tl8h_z7R18Dx4lioKVCHr7ug&s",
    name: "Chef's Special Combo",
    emoji: "✨",
  },
];

const GalleryPage = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] min-h-screen font-sans overflow-hidden">
      {/* ================== AMBIENT BACKGROUND GLOWS ================== */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-[#F7C35F] rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#E57A44] rounded-full blur-3xl opacity-15 animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#FFF7EB] rounded-full blur-3xl opacity-25 pointer-events-none"></div>

      {/* ================== FLOATING FOOD ICONS ================== */}
      <motion.div
        className="absolute w-12 sm:w-16 top-20 left-8 sm:left-16 opacity-40 filter drop-shadow-lg pointer-events-none"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-5xl sm:text-6xl">🍛</span>
      </motion.div>

      <motion.div
        className="absolute w-12 sm:w-16 bottom-32 right-10 sm:right-16 opacity-40 filter drop-shadow-lg pointer-events-none"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -15, 15, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-5xl sm:text-6xl">🥘</span>
      </motion.div>

      <motion.div
        className="absolute w-10 sm:w-14 top-1/3 right-12 opacity-30 filter drop-shadow-lg pointer-events-none hidden sm:block"
        animate={{ 
          x: [0, 15, 0],
          rotate: [0, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-4xl sm:text-5xl">🍜</span>
      </motion.div>

      {/* ================== PARALLAX HERO ================== */}
      <div className="relative h-[280px] sm:h-[350px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/f5a2c44e-f2dd-4f14-803e-75316a6d1502.png')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#6B3A1E]/70 via-[#6B3A1E]/50 to-[#6B3A1E]/70 backdrop-blur-[2px]"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
          {/* Steam Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 sm:mb-6 flex gap-3 sm:gap-4"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="text-3xl sm:text-4xl md:text-5xl"
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              >
                💨
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl text-center leading-tight"
            style={{ 
              fontFamily: "Georgia, serif",
              textShadow: "0 4px 30px rgba(0, 0, 0, 0.5)"
            }}
          >
            Maa ke Haath ka Swad ❤️
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/90 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg italic font-medium backdrop-blur-sm bg-white/10 px-4 sm:px-6 py-2 rounded-full border border-white/30"
          >
            Ghar ka pyaar, ek thali mein ✨
          </motion.p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0 50L60 45C120 40 240 30 360 25C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50H1440V100H0V50Z"
              fill="#FFF7EB"
            />
          </svg>
        </div>
      </div>

      {/* ================== SECTION HEADER ================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6B3A1E] mb-3 sm:mb-4"
            style={{ 
              fontFamily: "Georgia, serif",
              textShadow: "0 2px 20px rgba(247, 195, 95, 0.3)"
            }}
          >
            Our Signature Dishes
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-3"></div>
          <p className="text-[#6B3A1E]/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
            Har dish mein hai maa ka pyaar aur ghar ka zayka
          </p>
        </motion.div>

        {/* ================== MASONRY GRID ================== */}
        <motion.div
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-4 md:gap-6 space-y-3 sm:space-y-4 md:space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {foodImages.map((food, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl group shadow-lg hover:shadow-2xl transition-all duration-500 break-inside-avoid cursor-pointer"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>

              {/* Glass Card */}
              <div className="relative bg-white/60 backdrop-blur-xl border-2 border-white/80 rounded-2xl sm:rounded-3xl overflow-hidden">
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={food.src}
                    alt={food.name}
                    className="w-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    style={{ aspectRatio: "4/3" }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B3A1E]/80 via-[#6B3A1E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Emoji Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-[#E57A44]/30 group-hover:scale-110 transition-transform duration-300"
                  >
                    <span className="text-xl sm:text-2xl">{food.emoji}</span>
                  </motion.div>
                </div>

                {/* CONTENT */}
                <div className="p-3 sm:p-4 relative">
                  {/* Decorative Border */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent"></div>

                  <h3 
                    className="text-base sm:text-lg font-bold text-[#6B3A1E] text-center mt-2 group-hover:text-[#E57A44] transition-colors duration-300"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {food.name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="text-[#F7C35F] text-sm sm:text-base"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>

                  {/* Hover Action */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0, y: 10 }}
                    className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <button className="w-full bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-semibold py-2 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300">
                      Order Now 🛒
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================== PARALLAX FOOTER ================== */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden mt-12 sm:mt-16">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/2833abff-173c-483d-b197-c3c45e1ebe9b.png')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B3A1E]/80 via-[#6B3A1E]/60 to-[#E57A44]/70 backdrop-blur-[1px]"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl sm:text-6xl md:text-7xl mb-4"
            >
              ❤️
            </motion.div>
            
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl leading-tight"
              style={{ 
                fontFamily: "Georgia, serif",
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.6)"
              }}
            >
              Swad Jo Maa Ki Yaad Dilaye
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/90 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-medium backdrop-blur-sm bg-white/10 px-4 sm:px-6 py-2 rounded-full border border-white/30 inline-block"
            >
              Har bite mein ghर की khushboo 🏠
            </motion.p>
          </motion.div>
        </div>

        {/* Top Wave */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 rotate-180">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0 50L60 45C120 40 240 30 360 25C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50H1440V100H0V50Z"
              fill="#F7C35F"
            />
          </svg>
        </div>
      </div>

      {/* ================== DECORATIVE BOTTOM SECTION ================== */}
      <div className="relative py-8 sm:py-12 bg-gradient-to-b from-[#F7C35F] to-[#FFF7EB]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <p className="text-[#6B3A1E]/80 text-sm sm:text-base md:text-lg italic font-medium">
            "Khana sirf pet bharne ke liye nahi, dil ko sukoon dene ke liye bhi hota hai"
          </p>
          <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {["🍛", "❤️", "🏠"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="text-3xl sm:text-4xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage;