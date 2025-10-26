import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBillWave, FaWallet, FaCalendarAlt } from "react-icons/fa";

const earningsData = [
  {
    orderId: "#12345",
    date: "2025-07-14",
    items: "2x Roti, 1x Sabzi, 1x Dal",
    amount: 120,
    status: "Paid",
  },
  {
    orderId: "#12346",
    date: "2025-07-15",
    items: "3x Roti, 1x Paneer, Rice",
    amount: 150,
    status: "Pending",
  },
  {
    orderId: "#12347",
    date: "2025-07-16",
    items: "2x Roti, 1x Aloo, 1x Dal",
    amount: 100,
    status: "Paid",
  },
];

const ChefEarning = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const totalEarnings = earningsData
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-10 px-5">
      <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-10 drop-shadow-sm">
        🍱 Chef Earnings Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave className="text-4xl text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalEarnings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <FaWallet className="text-4xl text-indigo-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{earningsData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-4xl text-pink-500" />
            <div>
              <p className="text-gray-500 text-sm">Last Payment</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{earningsData[0].amount}
              </p>
              <p className="text-xs text-gray-500">{earningsData[0].date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="grid gap-5 max-w-3xl mx-auto">
        {earningsData.map((order) => (
          <motion.div
            key={order.orderId}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedOrder(order)}
          >
            <div>
              <p className="font-semibold text-gray-800">{order.orderId}</p>
              <p className="text-sm text-gray-500">{order.items}</p>
              <p className="text-sm text-gray-400">{order.date}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-800">₹{order.amount}</p>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  order.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 w-[95%] sm:w-[400px] shadow-xl relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-lg"
                onClick={() => setSelectedOrder(null)}
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
                Order Details
              </h2>
              <div className="text-gray-700 space-y-3 text-sm">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {selectedOrder.orderId}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {selectedOrder.date}
                </p>
                <p>
                  <span className="font-semibold">Items:</span>{" "}
                  {selectedOrder.items}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ₹
                  {selectedOrder.amount}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedOrder.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChefEarning;
