import app from './app.js';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { setIO } from './config/socket.js'; // ✅ Socket singleton

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Register the io instance into the singleton so controllers can use it
setIO(io);

// Chat logic
io.on("connection", (socket) => {
  socket.on("joinRoom", (orderId) => {
    socket.join(orderId);
  });

  socket.on("joinChefRoom", (chefId) => {
    socket.join(`chef:${chefId}`);
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    const { orderId, senderId, senderModel, message } = data;

    if (!orderId || !senderId || !senderModel || !message) return;

    try {
      const ChatMessage = (await import("./models/ChatMessage.js")).default;

      const newMsg = await ChatMessage.create({
        orderId,
        sender: senderId,
        senderModel,
        message,
      });

      // Emit to everyone in the room
      io.to(orderId).emit("receiveMessage", newMsg);
    } catch (err) {
      console.error("❌ Error saving chat message:", err);
    }
  });

  socket.on("disconnect", () => {});
});

// PORT must match the proxy in frontend/vite.config.js (/api → http://localhost:5000)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
