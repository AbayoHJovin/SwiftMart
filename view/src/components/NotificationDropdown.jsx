import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { apiUrl } from '../lib/apis';
import { format } from 'date-fns';

const NotificationDropdown = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${apiUrl}/notifications/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${apiUrl}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${apiUrl}/notifications/${userId}/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'OrderPlaced':
        return '🛍️';
      case 'OrderApproved':
        return '✅';
      case 'OrderCancelled':
        return '❌';
      case 'OrderDelivered':
        return '🚚';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                    !notification.isRead ? 'bg-green-50 dark:bg-green-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.notificationId)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 