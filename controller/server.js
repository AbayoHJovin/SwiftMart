const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const cookieParser = require("cookie-parser");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const FavRoutes = require("./Routes/favouriteRoutes");
const tokenRoutes = require("./Routes/tokenRoutes");
const offerRoutes = require("./Routes/offerRoutes");
const otpRoutes=require("./Routes/otpRoutes")
const subscriptionRoutes=require("./Routes/subscriptions")
const Paypal = require("./Routes/PaypalRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const orderRoutes = require("./Routes/orderRoutes");
require("dotenv").config();
const Mtn = require("./Routes/MTNRoutes");
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://homedel.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  }
});

// Store connected clients
const connectedClients = new Map();
const adminSockets = new Set();

// Verify token middleware for socket connections
const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.users.findUnique({
      where: { userId: decoded.userId }
    });
    
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Socket.IO connection handling with token verification
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error('Authentication token required');
    }

    const user = await verifyToken(token);
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user authentication
  socket.on('authenticateUser', async ({ userId, token }) => {
    try {
      const user = await verifyToken(token);
      if (user.userId !== userId) {
        throw new Error('Invalid user authentication');
      }
      
      connectedClients.set(userId, socket.id);
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    } catch (error) {
      socket.emit('auth_error', { message: error.message });
      socket.disconnect();
    }
  });

  // Handle admin authentication
  socket.on('authenticateAdmin', async ({ token }) => {
    try {
      const user = await verifyToken(token);
      if (user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }
      
      adminSockets.add(socket.id);
      console.log(`Admin authenticated with socket ${socket.id}`);
    } catch (error) {
      socket.emit('auth_error', { message: error.message });
      socket.disconnect();
    }
  });

  socket.on('disconnect', () => {
    // Remove from connected clients
    for (const [userId, socketId] of connectedClients.entries()) {
      if (socketId === socket.id) {
        connectedClients.delete(userId);
        break;
      }
    }
    // Remove from admin sockets
    adminSockets.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to other modules
app.set('io', io);
app.set('connectedClients', connectedClients);
app.set('adminSockets', adminSockets);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://homedel.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  })
);

app.use(express.json());

server.listen(5000, '0.0.0.0', () => {
  console.log("Server is running on port 5000");
});

app.use(userRoutes);
app.use(productRoutes);
app.use(tokenRoutes);
app.use(cartRoutes);
app.use(FavRoutes);
app.use(offerRoutes);
app.use(otpRoutes);
app.use(subscriptionRoutes)
app.use(Paypal);
app.use(Mtn);
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);