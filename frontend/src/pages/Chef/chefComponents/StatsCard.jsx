import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4"
  >
    <Icon className="text-3xl text-[#ff7e00]" />
    <div>
      <p className="text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </motion.div>
);

export default StatsCard;
