import React, { useState, useEffect, useRef } from 'react';
import { BsBell, BsBellFill } from 'react-icons/bs';
import { useNotifications } from '../../constants/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationComponent = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order_placed':
                return '🛍️';
            case 'order_approved':
                return '✅';
            case 'approval_message_updated':
                return '📝';
            case 'order_deleted':
                return '❌';
            default:
                return '📢';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {unreadCount > 0 ? (
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="relative"
                    >
                        <BsBellFill className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-2 transform scale-100">
                            {unreadCount}
                        </span>
                    </motion.div>
                ) : (
                    <BsBell className="h-6 w-6" />
                )}
            </button>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-sm text-gray-500">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                            {notifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                                                notification.isRead
                                                    ? 'bg-gray-50 hover:bg-gray-100'
                                                    : 'bg-blue-50 hover:bg-blue-100'
                                            }`}
                                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <span className="text-2xl">
                                                    {getNotificationIcon(notification.type)}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-800">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(notification.createdAt)}
                                                    </p>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationComponent; 