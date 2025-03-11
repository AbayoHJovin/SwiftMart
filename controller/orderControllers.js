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
            }
        });

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: ordererId,
                orderId: order.orderId,
                message: 'Your order has been placed successfully!',
                type: 'order_placed'
            }
        });

        // Create notification for admin (assuming admin has a specific userId)
        const admin = await prisma.users.findFirst({
            where: { email: process.env.ADMIN_EMAIL }
        });
        
        if (admin) {
            await prisma.notification.create({
                data: {
                    userId: admin.userId,
                    orderId: order.orderId,
                    message: `New order received from ${ordererId}`,
                    type: 'new_order'
                }
            });
        }

        res.status(201).json(order);
    } catch (error) {
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

module.exports = {
    createOrder,
    approveOrder,
    updateApprovalMessage,
    deleteOrder,
    getUserOrders
}; 