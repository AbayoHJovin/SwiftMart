const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const notificationController = {
  // Create a new notification
  createNotification: async (req, res) => {
    try {
      const { userId, title, message, type, orderId } = req.body;
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          orderId,
        },
      });
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  },

  // Get all notifications for a user
  getUserNotifications: async (req, res) => {
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
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await prisma.notification.update({
        where: { notificationId },
        data: { isRead: true }
      });
      res.status(200).json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  },

  // Mark all notifications as read for a user
  markAllNotificationsAsRead: async (req, res) => {
    try {
      const { userId } = req.params;
      await prisma.notification.updateMany({
        where: { userId },
        data: { isRead: true }
      });
      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark notifications as read" });
    }
  },

  // Get unread notification count
  getUnreadCount: async (req, res) => {
    try {
      const { userId } = req.params;
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      });
      res.status(200).json({ count });
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({ error: "Failed to get unread count" });
    }
  }
};

module.exports = notificationController; 