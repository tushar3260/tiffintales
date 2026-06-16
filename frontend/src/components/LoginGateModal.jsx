// LoginGateModal.jsx — Single reusable "Login Required" modal
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function LoginGateModal({ isOpen, onClose, redirectTo }) {
  const navigate = useNavigate();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLogin = () => {
    if (redirectTo) {
      sessionStorage.setItem("redirectAfterLogin", redirectTo);
    }
    navigate("/login");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100 rounded-full blur-3xl opacity-60" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <FaTimes className="text-gray-500 text-xs" />
            </button>

            {/* Lock Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg relative z-10">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="text-center relative z-10">
              <h2 className="text-xl font-black text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                Please log in to place your order and enjoy delicious homemade meals.
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogin}
                  className="w-full btn btn-primary"
                >
                  Log In to Continue
                </motion.button>
                <button
                  onClick={() => { navigate("/signup"); onClose(); }}
                  className="w-full btn btn-secondary text-sm"
                >
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
