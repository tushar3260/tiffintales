// OrderChat.jsx — Full real-time chat between user and chef over an order
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaArrowLeft, FaUtensils } from "react-icons/fa";
import { useUser } from "../context/userContext.jsx";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
const BASE = import.meta.env.VITE_API_URL;

const OrderChat = ({ isChef = false }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [order, setOrder] = useState(null);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const senderId = user?._id;
  const senderModel = isChef ? "Chef" : "User";

  // Fetch previous messages + order info
  useEffect(() => {
    if (!orderId) return;

    // Fetch chat history
    axios
      .get(`${BASE}/chat/${orderId}`)
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    // Fetch order details for header info
    axios
      .get(`${BASE}/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => {});
  }, [orderId]);

  // Setup socket
  useEffect(() => {
    if (!orderId || !senderId) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      // ✅ Join the order chat room
      socket.emit("joinRoom", orderId);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.disconnect();
    };
  }, [orderId, senderId]);

  // Auto-scroll to latest
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !socketRef.current?.connected) return;

    const msgData = { orderId, senderId, senderModel, message: message.trim() };
    socketRef.current.emit("sendMessage", msgData);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts) =>
    ts
      ? new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : "";

  return (
    <div className="flex flex-col h-screen bg-[#0f0f1a]">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#1a1a2e]/95 backdrop-blur-md shadow-xl px-4 py-3 border-b border-white/5 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-orange-400 transition"
        >
          <FaArrowLeft />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
            <FaUtensils />
          </div>
          <div>
            <p className="font-bold text-gray-100">
              {isChef ? "Customer Chat" : "Chat with Chef"}
            </p>
            <p className="text-xs text-gray-500">
              Order #{orderId?.slice(-6).toUpperCase()}
              {order && ` · ${order.status || "Active"}`}
            </p>
          </div>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold ${
            connected ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
          }`}
        >
          {connected ? "● Live" : "● Offline"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
            <div className="text-5xl">💬</div>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const isMine =
              String(msg.sender) === String(senderId) ||
              String(msg.senderId) === String(senderId);
            return (
              <motion.div
                key={msg._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    isMine
                      ? "bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-br-sm"
                      : "bg-[#1e1e30] text-gray-200 rounded-bl-sm border border-white/10"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${isMine ? "text-orange-100" : "text-gray-400"} text-right`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="bg-[#1a1a2e] border-t border-white/5 px-4 py-3 flex gap-2 items-center">
        <input
          className="flex-1 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#252540] text-gray-200 placeholder-gray-600"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connected ? "Type a message..." : "Connecting..."}
          disabled={!connected}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!connected || !message.trim()}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
            connected && message.trim()
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FaPaperPlane className="text-sm" />
        </motion.button>
      </div>
    </div>
  );
};

export default OrderChat;
