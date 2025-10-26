import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { storage } from "../../utils/Storage";

export default function AdminAllOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await storage.getItem("AdminToken"); // ✅ await added
      if (!token) {
        setError("Admin token missing. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 p-6">
      <motion.h2
        className="text-3xl font-bold text-orange-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        All Orders
      </motion.h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">User</th>
                <th className="p-3">Chef</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-yellow-100 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      {order.userId?.fullName || order.userId?.name || "N/A"}
                    </td>
                    <td className="p-3">{order.chefId?.name || "N/A"}</td>
                    <td className="p-3">₹{order.totalPrice}</td>
                    <td className="p-3">
                      <span
                        className={`font-semibold ${
                          order.status === "Delivered"
                            ? "text-green-600"
                            : order.status === "Preparing"
                            ? "text-yellow-600"
                            : order.status === "Cancelled"
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white px-4 py-1.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold"
                      >
                        👁 View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[95%] max-w-2xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-4 text-orange-700">
              Order Details
            </h3>

            <p>
              <strong>User:</strong>{" "}
              {selectedOrder.userId?.fullName || selectedOrder.userId?.name}
            </p>
            <p>
              <strong>User ID:</strong> {selectedOrder.userId?._id}
            </p>

            <p>
              <strong>Chef:</strong> {selectedOrder.chefId?.name}
            </p>
            <p>
              <strong>Chef ID:</strong> {selectedOrder.chefId?._id}
            </p>

            <p>
              <strong>Amount:</strong> ₹{selectedOrder.totalPrice}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  selectedOrder.status === "Delivered"
                    ? "text-green-600"
                    : selectedOrder.status === "Preparing"
                    ? "text-yellow-600"
                    : selectedOrder.status === "Cancelled"
                    ? "text-red-600"
                    : "text-gray-700"
                }
              >
                {selectedOrder.status}
              </span>
            </p>

            <p>
              <strong>Payment:</strong> {selectedOrder.paymentStatus} (
              {selectedOrder.paymentMode})
            </p>
            <p>
              <strong>Time Slot:</strong> {selectedOrder.timeSlot}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Items:</strong>
            </p>
            <ul className="pl-5 list-disc">
              {selectedOrder.meals.map((meal, idx) => (
                <li key={idx}>
                  {meal.mealId?.title || "Meal"} × {meal.quantity} — ₹
                  {meal.price}
                </li>
              ))}
            </ul>

            <p>
              <strong>Address:</strong>
            </p>
            <p className="pl-3">
              {selectedOrder.deliveryAddress?.street},{" "}
              {selectedOrder.deliveryAddress?.city},{" "}
              {selectedOrder.deliveryAddress?.pincode}
            </p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-red-600 hover:scale-110 font-bold text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
