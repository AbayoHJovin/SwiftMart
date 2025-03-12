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
const otpRoutes = require("./Routes/otpRoutes");
const subscriptionRoutes = require("./Routes/subscriptions");
const Paypal = require("./Routes/PaypalRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const orderRoutes = require("./Routes/orderRoutes");
require("dotenv").config();
const Mtn = require("./Routes/MTNRoutes");
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { verifyAccessToken, verifyRefreshToken } = require('../auth/isAuth');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

// Configure CORS with credentials
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://homedel.vercel.app"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Configure cookie parser
app.use(cookieParser());

// Configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
const verifySocketToken = async (socket, next) => {
  try {
    const accessToken = socket.handshake.auth.token || 
                       socket.handshake.headers.token ||
                       socket.handshake.query.token;

    if (!accessToken) {
      return next(new Error('Authentication error: No token provided'));
    }

    const { valid, data, error } = await verifyAccessToken(accessToken);
    
    if (!valid) {
      return next(new Error(`Authentication error: ${error}`));
    }

    socket.user = data;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

io.use(verifySocketToken);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user authentication
  socket.on('authenticateUser', async ({ userId }) => {
    try {
      const user = socket.user;
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
  socket.on('authenticateAdmin', async () => {
    try {
      const user = socket.user;
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