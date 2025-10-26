import app from './app.js';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // update for prod
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Chat logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // Join a chat room based on orderId
  socket.on("joinRoom", (orderId) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined order room: ${orderId}`);
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    const { orderId, senderId, senderModel, message } = data;

    if (!orderId || !senderId || !senderModel || !message) {
      console.warn("❌ Invalid message data received.");
      return;
    }

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

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export { io };
