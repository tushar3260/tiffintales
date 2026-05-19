import { io } from "socket.io-client";

let socket = null;

const initSocket = (query = {}) => {
  socket = io("http://localhost:5000", {
    query,
    transports: ["websocket"],
  });
  return socket;
};

// For CHEF: Connect with chefId and join room
export const connectChefSocket = (chefId, orderId) => {
  if (!chefId || !orderId) return;
  const s = initSocket({ chefId });
  s.on("connect", () => {
    s.emit("joinRoom", orderId);
  });
  return s;
};

// For USER: Connect and join room
export const connectUserSocket = (orderId) => {
  if (!orderId) return;
  const s = initSocket();
  s.on("connect", () => {
    s.emit("joinRoom", orderId);
  });
  return s;
};

// Emit message
export const sendMessage = (socket, { orderId, senderId, senderModel, message }) => {
  if (socket && socket.connected) {
    socket.emit("sendMessage", { orderId, senderId, senderModel, message });
  }
};

// Listen for messages
export const listenForMessages = (socket, callback) => {
  if (socket) {
    socket.on("receiveMessage", (data) => {
      callback(data);
    });
  }
};

// Cleanup
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
