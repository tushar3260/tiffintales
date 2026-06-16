// FloatingWhatsApp.jsx — Persistent WhatsApp chat button
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const WA_NUMBER = "919109999999";
const WA_MESSAGE = encodeURIComponent("Hello Tiffin Tales! I need help.");

export default function FloatingWhatsApp() {
  const [tooltip, setTooltip] = useState(true);
  const location = useLocation();

  // Hide on dashboard, chef, admin, checkout pages
  const hide = ["/dashboard", "/chef", "/admin", "/checkout"].some(p =>
    location.pathname.startsWith(p)
  );
  if (hide) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="relative bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-2xl shadow-lg border border-gray-100 whitespace-nowrap"
          >
            💬 Chat with us on WhatsApp
            <button
              onClick={() => setTooltip(false)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="text-[9px] inline" />
            </button>
            {/* Arrow */}
            <div className="absolute right-3 -bottom-1.5 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTooltip(false)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-xl shadow-green-300/50 flex items-center justify-center transition-colors"
      >
        <FaWhatsapp className="text-white text-2xl" />
        {/* Pulse ring */}
        <span className="absolute w-14 h-14 bg-green-400 rounded-full animate-ping opacity-30 pointer-events-none" />
      </motion.a>
    </div>
  );
}
