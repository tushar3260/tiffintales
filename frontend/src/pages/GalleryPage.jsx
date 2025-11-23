import React from "react";
import { motion } from "framer-motion";

const foodImages = [
  {
    src: "https://www.ruchiskitchen.com/wp-content/uploads/2020/12/Paneer-butter-masala-recipe-3-500x500.jpg",
    name: "Paneer Butter Masala",
    badge: "Signature",
    note: "Rich & Creamy",
  },
  {
    src: "https://t4.ftcdn.net/jpg/01/15/48/41/360_F_115484118_OFxvDHelhwIRAkNhXIfCZS6Py0eUyWJD.jpg",
    name: "Special Thali",
    badge: "Complete Meal",
    note: "Balanced & Hearty",
  },
  {
    src: "https://vegecravings.com/wp-content/uploads/2016/07/veg-pulao-recipe-step-by-step-instructions.jpg",
    name: "Veg Pulao",
    badge: "Home Style",
    note: "Aromatic & Light",
  },
  {
    src: "https://i.ytimg.com/vi/_borBb4g8LA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDI81swXgTev6_B75-pLQ6XMKcUZw",
    name: "Homestyle Roti",
    badge: "Fresh Daily",
    note: "Soft & Warm",
  },
  {
    src: "https://tastedilli6.com/cdn/shop/files/Dal-fry-restaurant-style.jpg?v=1685532226",
    name: "Dal Fry & Rice",
    badge: "Comfort Food",
    note: "Soul Warming",
  },
  {
    src: "https://img.freepik.com/premium-photo/salad-tomatoes-cucumber-red-onions-lettuce-leaves_2829-1732.jpg?semt=ais_hybrid&w=740",
    name: "Healthy Salad",
    badge: "Fresh & Light",
    note: "Garden Fresh",
  },
  {
    src: "https://t3.ftcdn.net/jpg/07/11/92/84/360_F_711928491_Am9rJkePY5UaeAZKSZQ9tFkWweUWVfSF.jpg",
    name: "Butter Naan",
    badge: "Signature",
    note: "Fluffy & Buttery",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1tJTGY_7Vq5tl8h_z7R18Dx4lioKVCHr7ug&s",
    name: "Chef's Special Combo",
    badge: "Best Seller",
    note: "Customer Favorite",
  },
];

const GalleryPage = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#FFFBF5] via-[#FFF8ED] to-[#FFEFD5] min-h-screen overflow-hidden">

      {/* ========== BACKGROUND NOISE TEXTURE ========== */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ========== SOFT COLOR GLOWS ========== */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#FFD699]/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F4A460]/6 rounded-full blur-[140px]" />

      {/* ========== DECORATIVE TAPE ELEMENTS ========== */}
      <div className="absolute top-24 left-16 w-40 h-3 bg-[#E8C18F]/30 rotate-12 rounded-sm shadow-sm" />
      <div className="absolute top-56 right-20 w-32 h-3 bg-[#D4A574]/25 -rotate-6 rounded-sm shadow-sm" />
      <div className="absolute bottom-40 left-1/3 w-36 h-3 bg-[#F4D9A6]/35 rotate-3 rounded-sm shadow-sm" />

      {/* ===================== HEADER ===================== */}
      <section className="relative px-4 sm:px-6 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-block relative">

              {/* Highlighter */}
              <div className="absolute inset-0 bg-[#FFE8CC]/40 blur-xl rounded-lg" />

              <h2 className="relative text-4xl md:text-5xl font-serif text-[#5C4033] px-8 py-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#F4D9A6]">
                Our Signature Collection
              </h2>

              {/* Bouncy Arrow */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[#E8B55F] text-4xl"
              >
                ↓
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== GALLERY GRID ===================== */}
      <section className="relative px-4 sm:px-6 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12">

          {foodImages.map((food, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate:
                  i % 3 === 0 ? -2.5 :
                  i % 3 === 1 ? 2.5 : -1.5,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                type: "spring",
                bounce: 0.4,
              }}
              whileHover={{
                y: -16,
                rotate: 0,
                scale: 1.02,
                transition: { duration: 0.4 },
              }}
              className="group cursor-pointer"
            >
              {/* POLAROID FRAME */}
              <div className="relative bg-white p-5 pb-20 rounded-2xl shadow-[0_10px_40px_rgba(92,64,51,0.12)] group-hover:shadow-[0_20px_60px_rgba(92,64,51,0.18)] transition-all">

                {/* Tape strip */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-[#F4D9A6]/60 rounded shadow-md border-l border-r border-[#E8C18F]/40"
                />

                {/* IMAGE */}
                <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-5 bg-[#F4EDE3]">
                  <img
                    src={food.src}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{
                      filter:
                        "contrast(1.1) saturate(1.2) brightness(1.02) sepia(0.05)",
                    }}
                  />

                  {/* Warm overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F4A460]/8 via-transparent to-[#E8C18F]/8" />

                  {/* Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                    className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full shadow-lg border-2 border-[#E8C18F] text-xs font-semibold text-[#C17A3F]"
                  >
                    {food.badge}
                  </motion.div>
                </div>

                {/* CAPTION */}
                <div className="text-center px-3">
                  <h3 className="text-[#5C4033] text-xl font-serif mb-2 group-hover:text-[#E57A44] transition-colors">
                    {food.name}
                  </h3>

                  <p className="text-[#8B7968] text-sm italic mb-3">{food.note}</p>

                  {/* Hearts */}
                  <div className="flex justify-center gap-1.5 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        className="text-[#E8B55F]"
                      >
                        ♥
                      </motion.span>
                    ))}
                  </div>

                  <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#E8C18F] to-transparent mx-auto" />
                </div>

                {/* Page-curl effect */}
                <div
                  className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-[#F4EDE3] to-white/50 rounded-tl-3xl opacity-70 group-hover:opacity-100"
                  style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
                />

                {/* Sparkle */}
                <motion.div
                  className="absolute -top-3 -right-3 text-4xl opacity-0 group-hover:opacity-100 transition-all"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>

              </div>
            </motion.div>
          ))}

        </div>

        {/* Bottom Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center gap-6 mt-20"
        >
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent to-[#E8C18F]" />
          <span className="text-[#E57A44] text-3xl">♥</span>
          <div className="w-24 h-[1.5px] bg-gradient-to-l from-transparent to-[#E8C18F]" />
        </motion.div>
      </section>

      {/* ===================== FLOATING EMOJIS ===================== */}
      <section className="relative px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto flex justify-center gap-12">

          {["🌿", "✨", "♥", "🌸", "✨", "🌿"].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -12, 0],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
              className="text-3xl opacity-30 hidden md:inline-block"
            >
              {emoji}
            </motion.span>
          ))}

        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
