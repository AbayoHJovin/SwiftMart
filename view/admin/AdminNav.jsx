/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../constants/NotificationContext";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Search,
} from "lucide-react";

const AdminNav = ({ currentBar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const notificationRef = useRef();
  const userRef = useRef();

  // Filter unread notifications
  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead && notification.type === 'new_order'
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
    setShowNotifications(false);
    // Navigate to orders page with filter for unread/unapproved orders
    navigate("/authorized/Admin/orders?filter=unapproved");
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              {currentBar}
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1 md:flex-none">
              <motion.div
                initial={false}
                animate={{ width: isSearchOpen ? "100%" : "240px" }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-green-500 dark:text-white text-sm"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </motion.div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          New Orders
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {unreadNotifications.length === 0 ? (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                            No new orders
                          </p>
                        ) : (
                          unreadNotifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 bg-green-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-gray-600 transition-colors duration-200"
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  New Order
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </p>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="https://res.cloudinary.com/dpxldzsp3/image/upload/v1732786183/profile_pictures/xu78klci2sdxohxaf4ze.jpg"
                  alt="Admin"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Jovin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-2 space-y-1">
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200">
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
