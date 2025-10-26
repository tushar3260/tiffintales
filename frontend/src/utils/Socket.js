import { io } from "socket.io-client";

let socket = null;

// ✅ Common initializer (used internally)
const initSocket = (query = {}) => {
  socket = io("http://localhost:5000", {
    query,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });

  return socket;
};

// ✅ For CHEF: Connect with chefId and join room
export const connectChefSocket = (chefId, orderId) => {
  if (!chefId || !orderId) return;

  const s = initSocket({ chefId });

  s.on("connect", () => {
    s.emit("joinRoom", orderId);
    console.log(`👨‍🍳 Chef joined room: ${orderId}`);
  });

  return s;
};

// ✅ For USER: Connect and join room
export const connectUserSocket = (orderId) => {
  if (!orderId) return;

  const s = initSocket();

  s.on("connect", () => {
    s.emit("joinRoom", orderId);
    console.log(`👤 User joined room: ${orderId}`);
  });

  return s;
};

// ✅ Emit message
export const sendMessage = (socket, { orderId, senderId, senderModel, message }) => {
  if (socket && socket.connected) {
    socket.emit("sendMessage", {
      orderId,
      senderId,
      senderModel, // 'user' or 'chef'
      message,
    });
  }
};

// ✅ Listen for messages
export const listenForMessages = (socket, callback) => {
  if (socket) {
    socket.on("receiveMessage", (data) => {
      console.log("📩 New message:", data);
      callback(data);
    });
  }
};

// ✅ Cleanup
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
