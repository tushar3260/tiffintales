import React from 'react';
import { motion } from 'framer-motion';
import { useChef } from '../Context/ChefContext';

const Header = () => {
  const { chef } = useChef(); // ✅ Accessing context
  const chefName = chef?.name || 'Chef'; // ✅ Safe access

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center gap-3 items-center mb-6"
    >
      <h2 className="text-3xl font-bold text-[#ff7e00]">
        Welcome Back, {chefName}! 👨‍🍳
      </h2>
      <input
        type="text"
        placeholder="Search"
        className="border border-gray-300 rounded-xl p-2 px-4 shadow-sm"
      />
    </motion.div>
  );
};

export default Header;
