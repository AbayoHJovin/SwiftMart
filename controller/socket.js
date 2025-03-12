const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const initializeSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174", "https://homedel.vercel.app"],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'token', 'admin-token', 'user-token'],
        }
    });

    // Store connected clients
    const connectedClients = new Map();
    const adminSockets = new Set();

    // Verify token middleware for socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                throw new Error('Authentication token required');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.users.findUnique({
                where: { userId: decoded.userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error('Socket authentication error:', error);
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Handle user authentication
        socket.on('authenticateUser', async ({ userId, token }) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.userId !== userId) {
                    throw new Error('Invalid user authentication');
                }

                // Store the connection
                connectedClients.set(userId, socket.id);
                console.log(`User ${userId} authenticated with socket ${socket.id}`);

                // Send initial unread count
                const unreadCount = await prisma.notification.count({
                    where: {
                        userId,
                        isRead: false
                    }
                });
                socket.emit('unreadCount', { count: unreadCount });

            } catch (error) {
                console.error('User authentication error:', error);
                socket.emit('auth_error', { message: error.message });
                socket.disconnect();
            }
        });

        // Handle admin authentication
        socket.on('authenticateAdmin', async ({ token }) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await prisma.users.findUnique({
                    where: { userId: decoded.userId }
                });

                if (!user || user.role !== 'admin') {
                    throw new Error('Unauthorized: Admin access required');
                }

                // Store admin socket
                adminSockets.add(socket.id);
                console.log(`Admin authenticated with socket ${socket.id}`);

                // Send initial unread orders count
                const unreadOrders = await prisma.orders.count({
                    where: {
                        status: 'pending'
                    }
                });
                socket.emit('unreadOrdersCount', { count: unreadOrders });

            } catch (error) {
                console.error('Admin authentication error:', error);
                socket.emit('auth_error', { message: error.message });
                socket.disconnect();
            }
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
            const userSocketId = connectedClients.get(data.userId);
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
            const userSocketId = connectedClients.get(data.userId);
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

    io.on("error", (error) => {
        console.error("Socket.IO error:", error);
    });

    console.log(`Socket.IO server running at http://localhost:${server.address().port}`);

    return {
        io,
        connectedClients,
        adminSockets
    };
};

module.exports = initializeSocket;
