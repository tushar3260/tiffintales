import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaUser, FaUtensils, FaBoxOpen, FaCog } from 'react-icons/fa';

const menuItems = [
  { icon: <FaHome />, label: 'Dashboard' },
  { icon: <FaUser />, label: 'My Profile' },
  { icon: <FaUtensils />, label: 'My Meals' },
  { icon: <FaBoxOpen />, label: 'Order History' },
  { icon: <FaCog />, label: 'Settings' },
];

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isHovered ? 260 : 80 }}
      transition={{ duration: 0.3, type: 'tween' }}
      className="bg-white shadow-md border-r border-orange-100 h-screen relative z-20"
    >
      <div className="px-4 py-5 border-b border-orange-100 flex items-center justify-center">
        <AnimatePresence>
          {isHovered && (
            <motion.h2
              className="text-xl font-bold text-orange-600 tracking-wide"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              Tiffin Tales
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      <ul className="mt-6 space-y-3">
        {menuItems.map(({ icon, label }) => (
          <motion.li
            whileHover={{ scale: 1.04 }}
            key={label}
            className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded hover:bg-orange-50 text-gray-700"
          >
            <span className="text-lg text-orange-500">{icon}</span>
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  className="font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
}
