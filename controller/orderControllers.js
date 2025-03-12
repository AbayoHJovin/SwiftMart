const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { ordererId, address, phoneNo, paymentMethod, price, orderItems } = req.body;
        
        const order = await prisma.orders.create({
            data: {
                ordererId,
                address,
                phoneNo,
                paymentMethod,
                price,
                orderItems: {
                    create: orderItems
                }
            },
            include: {
                orderer: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Get the socket.io instance
        const io = req.app.get('io');
        const adminSockets = req.app.get('adminSockets');

        // Create detailed order information for admin notification
        const orderDetails = {
            orderId: order.orderId,
            customer: {
                id: order.orderer.userId,
                name: order.orderer.name || 'N/A',
                email: order.orderer.email,
                phone: order.phoneNo
            },
            orderInfo: {
                total: order.price,
                paymentMethod: order.paymentMethod,
                address: order.address,
                date: order.orderDate,
                status: order.status
            },
            items: order.orderItems.map(item => ({
                productId: item.product.productId,
                name: item.product.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        // Send real-time notification to all admin sockets with detailed information
        adminSockets.forEach(socketId => {
            io.to(socketId).emit('newOrder', {
                type: 'new_order',
                orderId: order.orderId,
                message: `New order #${order.orderId} received from ${order.orderer.name || order.orderer.email}`,
                createdAt: new Date(),
                orderDetails: orderDetails
            });
        });

        // Create notification records in database
        const admins = await prisma.users.findMany({
            where: { role: 'admin' }
        });

        await Promise.all(admins.map(admin =>
            prisma.notification.create({
                data: {
                    userId: admin.userId,
                    orderId: order.orderId,
                    message: `New order #${order.orderId} received from ${order.orderer.name || order.orderer.email}`,
                    type: 'new_order',
                    metadata: JSON.stringify(orderDetails) // Store detailed order info in metadata
                }
            })
        ));

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: ordererId,
                orderId: order.orderId,
                message: `Your order #${order.orderId} has been placed successfully!`,
                type: 'order_placed'
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Approve order
const approveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { approvalMessage } = req.body;

        const order = await prisma.orders.update({
            where: { orderId },
            data: {
                approved: true,
                approvalMessage
            },
            include: {
                orderer: true
            }
        });

        // Send real-time notification based on status
        io.emit('orderApproved', {
            userId: order.ordererId,
            orderId: order.orderId
        });

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: order.ordererId,
                orderId: order.orderId,
                message: approvalMessage 
                    ? `Your order has been approved with message: ${approvalMessage}`
                    : 'Your order has been approved!',
                type: 'order_approved'
            }
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update approval message
const updateApprovalMessage = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { approvalMessage } = req.body;

        const order = await prisma.orders.update({
            where: { orderId },
            data: { approvalMessage },
            include: {
                orderer: true
            }
        });

        // Create notification for user about updated message
        await prisma.notification.create({
            data: {
                userId: order.ordererId,
                orderId: order.orderId,
                message: `Your order approval message has been updated: ${approvalMessage}`,
                type: 'approval_message_updated'
            }
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await prisma.orders.findUnique({
            where: { orderId },
            include: { orderer: true }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Delete the order
        await prisma.orders.delete({
            where: { orderId }
        });

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: order.ordererId,
                message: `Your order ${orderId} has been deleted`,
                type: 'order_deleted'
            }
        });

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await prisma.orders.findMany({
            where: { ordererId: userId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                orderDate: 'desc'
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, reason } = req.body;

        const order = await prisma.orders.update({
            where: { orderId },
            data: { status },
            include: {
                orderer: true
            }
        });

        // Get socket.io instance and connected clients
        const io = req.app.get('io');
        const connectedClients = req.app.get('connectedClients');

        // Send real-time notification based on status
        if (status === 'approved') {
            const userSocketId = connectedClients.get(order.ordererId);
            if (userSocketId) {
                io.to(userSocketId).emit('orderNotification', {
                    type: 'order_approved',
                    orderId: order.orderId,
                    message: `Your order #${order.orderId} has been approved!`,
                    createdAt: new Date()
                });
            }

            // Create notification in database
            await prisma.notification.create({
                data: {
                    userId: order.ordererId,
                    orderId: order.orderId,
                    message: `Your order #${order.orderId} has been approved!`,
                    type: 'order_approved'
                }
            });
        } else if (status === 'rejected') {
            const userSocketId = connectedClients.get(order.ordererId);
            if (userSocketId) {
                io.to(userSocketId).emit('orderNotification', {
                    type: 'order_rejected',
                    orderId: order.orderId,
                    message: `Your order #${order.orderId} has been rejected. ${reason ? `Reason: ${reason}` : ''}`,
                    createdAt: new Date()
                });
            }

            // Create notification in database
            await prisma.notification.create({
                data: {
                    userId: order.ordererId,
                    orderId: order.orderId,
                    message: `Your order #${order.orderId} has been rejected. ${reason ? `Reason: ${reason}` : ''}`,
                    type: 'order_rejected'
                }
            });
        }

        res.json(order);
    } catch (error) {
        console.error('Order status update error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    approveOrder,
    updateApprovalMessage,
    deleteOrder,
    getUserOrders,
    updateOrderStatus
}; 