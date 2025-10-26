import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useChef } from "../Context/ChefContext";

const MessageCard = () => {
  const { chef } = useChef();
  const chefId = chef?._id;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!chefId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/chef/${chefId}`
      );

      // ✅ Normalize data safely
      const orders = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.orders)
        ? res.data.orders
        : [];
        console.log(orders)
      // ✅ Extract only orders having notes/instructions
      const msgs = orders
        .filter((o) => o.specialInstructions || o.notes)
        .map((o) => ({
          name: o.userId?.name || "Customer",
          message: o.specialInstructions || o.notes,
          createdAt: o.createdAt,
        }));

      setMessages(msgs.slice(0, 3)); // Show only latest 3
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chefId]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-3">📩 Messages</h3>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading messages...</p>
      ) : messages.length > 0 ? (
        messages.map((msg, idx) => (
          <div key={idx} className="flex gap-4 items-start mb-4">
            <FaEnvelope className="text-2xl text-[#ff7e00] mt-1" />
            <div>
              <p>
                <strong>{msg.name}</strong>: {msg.message}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No messages yet.</p>
      )}

      {messages.length > 0 && (
        <button className="mt-4 bg-[#ff7e00] text-white py-1 px-4 rounded-lg text-sm hover:bg-orange-600">
          View All Messages
        </button>
      )}
    </motion.div>
  );
};

export default MessageCard;
