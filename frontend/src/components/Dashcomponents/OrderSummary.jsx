import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaClock, FaRedo } from "react-icons/fa";
import { useUser } from "../../context/userContext.jsx";

export default function MyOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/user/${user?._id}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchOrders();
  }, [user]);

  if (loading)
    return <div className="text-center py-6 text-gray-500">Loading orders...</div>;
  if (!orders.length)
    return <div className="text-center py-6 text-gray-600">No orders yet.</div>;

  const statusClasses = {
    placed: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    preparing: "bg-orange-100 text-orange-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {orders.map((order, index) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl shadow-md p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-lg transition"
        >
          {/* Left - Meal Info */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto">
            <img
              src={order.meals?.[0]?.mealId?.photo || "https://via.placeholder.com/80"}
              alt={order.meals?.[0]?.mealId?.title || "Meal"}
              className="w-20 h-20 rounded-xl object-cover mx-auto sm:mx-0"
            />
            <div className="mt-3 sm:mt-0">
              <h4 className="text-lg font-semibold text-gray-800">
                {order.meals?.map((m) => m.mealId?.title).join(", ")}
              </h4>
              <p className="text-sm text-gray-500">
                Qty: {order.meals?.reduce((acc, m) => acc + (m.quantity || 1), 0)}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city} ({order.deliveryAddress?.pincode})
              </p>
              <span
                className={`inline-block px-3 py-1 text-xs rounded-full mt-2 ${statusClasses[order.status?.toLowerCase()] || "bg-gray-200 text-gray-600"}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Right - Price & Actions */}
          <div className="text-right w-full sm:w-auto">
            <div>
              <p className="text-xl font-bold text-gray-900">₹{order.totalPrice}</p>
              <p className="text-xs text-gray-400 flex items-center justify-end mt-1">
                <FaClock className="mr-1" />{" "}
                {new Date(order.createdAt).toLocaleDateString()} ({order.timeSlot})
              </p>
              <p className="text-xs text-gray-500">
                Payment: {order.paymentMode} ({order.paymentStatus})
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4 flex-wrap">
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition w-full sm:w-auto">
                Track Order
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-50 transition w-full sm:w-auto">
                <FaRedo /> Reorder
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
