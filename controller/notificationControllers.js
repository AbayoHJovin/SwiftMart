const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { userId, orderId, message, type } = req.body;
        const notification = await prisma.notification.create({
            data: {
                userId,
                orderId,
                message,
                type
            }
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's notifications
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: [
                { isRead: 'asc' },
                { createdAt: 'desc' }
            ],
            include: {
                order: true
            }
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    getUnreadCount
}; 