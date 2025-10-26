import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaPlus, FaRupeeSign } from "react-icons/fa";

export default function Wallet() {
  const [balance, setBalance] = useState(1500);
  const transactions = [
    { id: 1, date: "21 July", amount: -120, label: "Meal Purchase" },
    { id: 2, date: "19 July", amount: -200, label: "Meal Purchase" },
    { id: 3, date: "15 July", amount: +500, label: "Wallet Recharge" },
  ];

  const addMoney = () => setBalance(balance + 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen space-y-8">
      {/* Wallet Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-yellow-400 to-orange-500 p-5 sm:p-6 rounded-xl shadow-md text-white">
        <div className="flex items-center gap-3">
          <FaWallet className="text-3xl" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Wallet</h1>
            <p className="text-sm opacity-90">Track your balance & transactions</p>
          </div>
        </div>
        <button onClick={addMoney} className="w-full sm:w-auto bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 flex items-center gap-2 justify-center transition">
          <FaPlus /> Add Money
        </button>
      </div>

      {/* Current Balance */}
      <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-5 rounded-xl shadow text-center">
        <h2 className="text-lg font-semibold text-gray-700">Current Balance</h2>
        <p className="text-3xl font-bold text-green-600 flex items-center justify-center gap-1 mt-2">
          <FaRupeeSign /> {balance}
        </p>
      </motion.div>

      {/* Transaction History */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
        <div className="divide-y divide-gray-200">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition">
              <div>
                <p className="font-medium text-gray-800">{txn.label}</p>
                <p className="text-sm text-gray-500">{txn.date}</p>
              </div>
              <p className={`font-bold ${txn.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                {txn.amount > 0 ? "+" : "-"}₹{Math.abs(txn.amount)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
