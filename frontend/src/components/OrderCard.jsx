import React from 'react';
import { motion } from 'framer-motion';

export default function OrderCard() {
  return (
    <motion.div
      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between mb-2">
        <h4 className="font-semibold text-orange-600">Tiffin #12345</h4>
        <span className="text-green-600 text-sm">Delivered</span>
      </div>
      <p className="text-gray-700">Items: 2x Roti, 1x Sabzi, 1x Dal, 1x Rice</p>
      <p className="text-gray-500 text-sm">Delivered on: 14 July 2025</p>
    </motion.div>
  );
}
