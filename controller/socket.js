const port = 3000; // Use a non-privileged port
const io = require("socket.io")(port, {
  cors: { origin: "http://localhost:5173" },
});

// Store user socket mappings
const userSockets = new Map();
const adminSockets = new Set();

// Log when a client connects
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle user authentication
  socket.on("authenticateUser", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} authenticated with socket ${socket.id}`);
  });

  // Handle admin authentication
  socket.on("authenticateAdmin", () => {
    adminSockets.add(socket.id);
    console.log(`Admin authenticated with socket ${socket.id}`);
  });

  // Handle new order notifications (for admin)
  socket.on("newOrder", (orderData) => {
    // Notify all admin sockets
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit("orderNotification", {
        type: "new_order",
        message: `New order received from ${orderData.userName}`,
        orderId: orderData.orderId,
        timestamp: new Date()
      });
    });
  });

  // Handle order approval notifications (for users)
  socket.on("orderApproved", (data) => {
    const userSocketId = userSockets.get(data.userId);
    if (userSocketId) {
      io.to(userSocketId).emit("orderNotification", {
        type: "order_approved",
        message: `Your order #${data.orderId} has been approved!`,
        orderId: data.orderId,
        timestamp: new Date()
      });
    }
  });

  // Handle order rejection notifications (for users)
  socket.on("orderRejected", (data) => {
    const userSocketId = userSockets.get(data.userId);
    if (userSocketId) {
      io.to(userSocketId).emit("orderNotification", {
        type: "order_rejected",
        message: `Your order #${data.orderId} has been rejected. Reason: ${data.reason}`,
        orderId: data.orderId,
        timestamp: new Date()
      });
    }
  });

  // Handle offer notifications
  socket.on("offer", (message) => {
    console.log("Offer received:", message);
    io.emit("receivedOffer", message);
  });

  socket.on("disconnect", () => {
    // Clean up user socket mapping
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    
    // Clean up admin socket
    if (adminSockets.has(socket.id)) {
      adminSockets.delete(socket.id);
      console.log(`Admin disconnected: ${socket.id}`);
    }
    
    console.log(`Client disconnected: ${socket.id}`);
  });
});

io.on("error", (error) => {
  console.error("Socket.IO error:", error);
});

console.log(`Socket.IO server running at http://localhost:${port}`);
