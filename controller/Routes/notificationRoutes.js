const express = require('express');
const router = express.Router();
const { 
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    getUnreadCount
} = require('../notificationControllers');
const { authMiddleware } = require('../../auth/isAuth');

// Create a new notification (admin only)
router.post('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}, createNotification);

// Get user's notifications (with role check)
router.get('/user/:userId', authMiddleware, (req, res, next) => {
    if (req.user.userId === req.params.userId || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied' });
    }
}, getUserNotifications);

// Mark notification as read (with ownership check)
router.put('/:notificationId/read', authMiddleware, async (req, res, next) => {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: req.params.notificationId }
        });
        
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        
        if (notification.userId === req.user.userId || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}, markNotificationAsRead);

// Get unread notification count (with role check)
router.get('/user/:userId/unread', authMiddleware, (req, res, next) => {
    if (req.user.userId === req.params.userId || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied' });
    }
}, getUnreadCount);

module.exports = router; 