import React from 'react';
import { motion } from 'framer-motion';

export default function ProfileHeader() {
  return (
    <motion.div
      className="flex items-center gap-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src="https://i.pravatar.cc/100?img=5"
        alt="User Avatar"
        className="w-20 h-20 rounded-full border-4 border-orange-500 shadow-md"
        whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px #fb923c' }}
        transition={{ type: 'spring', stiffness: 200 }}
      />
      <div>
        <h2 className="text-2xl font-bold text-orange-600">Welcome, Ramesh Bhai</h2>
        <p className="text-gray-600">rameshbhai@tiffintales.in</p>
        <p className="text-sm text-green-600">Subscribed Plan: Monthly Tiffin</p>
      </div>
    </motion.div>
  );
}
