import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import ChefLogin from './ChefLogin';
import ChefSignup from './ChefSignup';

const ChefLanding = ({ disableButtons = false }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff8ee] text-gray-800 font-sans overflow-x-hidden relative">
      <Toaster />

      {/* Blur Layer (only when /chef/login or /chef/signup) */}
      {disableButtons && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-10 pointer-events-none"></div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 bg-[#fff3da] relative z-20">
        <motion.div
          className="md:w-1/2 mb-6 md:mb-0"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500 leading-tight">
            Bring Your Tiffin Tales to Life 🍱
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Join hundreds of home chefs building their food journey with Tiffin Tales.
          </p>

          {/* Hide buttons if disableButtons is true */}
          {!disableButtons && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignup(true)}
              className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
            >
              Become a Chef
            </motion.button>
          )}
        </motion.div>

        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://media.istockphoto.com/id/626998740/photo/beautiful-woman-cooking.webp?a=1&b=1&s=612x612&w=0&k=20&c=Pueokr4dGzRmU-WsM2cfyBC7vnTOB1dnQRlB3YJBP5o="
            alt="Chef Cooking"
            className="max-w-[90%] md:max-w-[70%] rounded-xl shadow-md"
          />
        </motion.div>
      </section>

      {/* Why Join Section */}
      <section className="px-6 md:px-20 py-14 bg-white relative z-20">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Why Join Tiffin Tales as a Chef?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Flexible Timings',
              desc: 'Cook and deliver on your own schedule. Perfect for home-based chefs.',
            },
            {
              title: 'Zero Commission',
              desc: 'We don’t take a cut. Your earnings are 100% yours.',
            },
            {
              title: 'Verified Customers',
              desc: 'Serve real customers who love homemade food.',
            },
            {
              title: 'Support Team',
              desc: 'Got questions? Our support is just a call away.',
            },
            {
              title: 'Chef Community',
              desc: 'Connect and grow with other passionate home chefs.',
            },
            {
              title: 'Personal Dashboard',
              desc: 'Track your orders, income, and feedback all in one place.',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-[#fff8ee] rounded-lg p-6 shadow hover:shadow-md transition"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-orange-600">{feature.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      {!disableButtons && (
        <motion.section
          className="text-center py-12 bg-orange-50 border-t border-orange-100 relative z-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">
            Ready to Serve Your Tiffin Tales?
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSignup(true)}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200"
          >
            Join as a Chef Now
          </motion.button>
        </motion.section>
      )}

      {/* Modals */}
      {!disableButtons && showLogin && (
        <ChefLogin
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {!disableButtons && showSignup && (
        <ChefSignup
          onClose={() => setShowSignup(false)}
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default ChefLanding;
