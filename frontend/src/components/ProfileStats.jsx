import React from 'react';
import { motion } from 'framer-motion';

export default function ProfileStats() {
  const stats = [
    { label: 'Meals Delivered', value: '76', color: 'orange-400' },
    { label: 'Current Balance', value: '₹240', color: 'green-400' },
    { label: 'Tiffin Rating', value: '4.7 ⭐', color: 'blue-400' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={`bg-white p-4 rounded-lg shadow border-l-4 border-${stat.color} hover:shadow-lg`}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-xl font-bold">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
