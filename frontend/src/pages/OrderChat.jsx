// OrderChat.jsx
import React, { useEffect, useState, useRef } from "react";
import { connectUserSocket, connectChefSocket } from "../utils/Socket";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderChat = ({ userType, userId }) => {
  const { orderId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/chat/messages/${orderId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    fetchMessages();
  }, [orderId]);

  // Setup socket connection
  useEffect(() => {
    if (!orderId || !userId || !userType) return;

    if (userType === "chef") {
      socketRef.current = connectChefSocket(userId, orderId);
    } else {
      socketRef.current = connectUserSocket(orderId);
    }

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [orderId, userId, userType]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!message.trim()) return;

    const msgData = {
      orderId,
      senderId: userId,
      senderModel: userType,
      message,
    };

    socketRef.current.emit("sendMessage", msgData);
    setMessage("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto min-h-[80vh] flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-center">Chat with Chef</h2>
      <div className="flex-1 overflow-y-auto border p-3 rounded shadow mb-4 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === userId ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === userId
                  ? "bg-orange-400 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button
          className="bg-orange-500 text-white px-4 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default OrderChat;
