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
        res.status(201).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error creating notification'
        });
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
        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error fetching notifications'
        });
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
        res.json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error marking notification as read'
        });
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
        res.json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error getting unread count'
        });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    getUnreadCount
}; 