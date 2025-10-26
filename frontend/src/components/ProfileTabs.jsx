import React, { useState } from 'react';
import OrderCard from './OrderCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileTabs() {
  const [tab, setTab] = useState('meals');
  const tabs = ['meals', 'profile', 'history'];

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {tabs.map((item) => (
          <motion.button
            key={item}
            onClick={() => setTab(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-2 rounded font-medium transition-all duration-200 ${
              tab === item
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white border text-gray-700 hover:bg-orange-100'
            }`}
          >
            {item.toUpperCase()}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'meals' && (
          <motion.div
            key="meals"
            className="grid gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <OrderCard />
            <OrderCard />
          </motion.div>
        )}
        {tab === 'profile' && (
          <motion.p
            key="profile"
            className="text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Your profile settings here...
          </motion.p>
        )}
        {tab === 'history' && (
          <motion.p
            key="history"
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No past orders found.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
