const express = require("express");
const router = express.Router();
const notificationController = require("../notificationControllers");
const { isAuth } = require("../../auth/isAuth");

// Create a new notification
router.post("/notifications", isAuth, (req, res, next) => {
  notificationController.createNotification(req, res).catch(next);
});

// Get all notifications for a user
router.get("/notifications/:userId", isAuth, (req, res, next) => {
  notificationController.getUserNotifications(req, res).catch(next);
});

// Get unread notification count
router.get("/notifications/:userId/unread", isAuth, (req, res, next) => {
  notificationController.getUnreadCount(req, res).catch(next);
});

// Mark a notification as read
router.patch("/notifications/:notificationId/read", isAuth, (req, res, next) => {
  notificationController.markNotificationAsRead(req, res).catch(next);
});

// Mark all notifications as read for a user
router.patch("/notifications/:userId/read-all", isAuth, (req, res, next) => {
  notificationController.markAllNotificationsAsRead(req, res).catch(next);
});

module.exports = router; 