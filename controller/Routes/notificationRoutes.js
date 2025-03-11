const express = require('express');
const router = express.Router();
const { 
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    getUnreadCount
} = require('../notificationControllers');
const { verifyToken } = require('../../auth/verifyToken');

// Create a new notification
router.post('/', verifyToken, createNotification);

// Get user's notifications
router.get('/user/:userId', verifyToken, getUserNotifications);

// Mark notification as read
router.put('/:notificationId/read', verifyToken, markNotificationAsRead);

// Get unread notification count
router.get('/user/:userId/unread', verifyToken, getUnreadCount);

module.exports = router; 