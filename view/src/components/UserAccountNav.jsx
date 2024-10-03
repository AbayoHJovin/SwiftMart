/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBell, FaUserAlt, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { ThemeContext } from "../../constants/ThemeContext";

const UserNav = ({ currentBar }) => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // Theme state
  const { theme, toggleTheme } = useContext(ThemeContext);

  const notificationRef = useRef();
  const userRef = useRef();

  // Handle clicking outside the dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

//   // Toggle theme function
//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     if (isDarkMode) {
//       document.documentElement.classList.remove("dark");
//     } else {
//       document.documentElement.classList.add("dark");
//     }
//   };

  return (
    <header className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 transition-colors duration-300 sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex-1 font-bold text-lg max-w-md text-gray-800 dark:text-gray-200">
        <h1>{currentBar}</h1>
      </div>

      {/* Notification and User Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative" ref={notificationRef}>
          <button
            className="relative"
            onClick={() =>
              setShowNotificationDropdown(!showNotificationDropdown)
            }
          >
            <FaBell className="h-6 w-6 text-gray-600 dark:text-gray-200" />
            {/* Show badge if there are new notifications */}
            {hasNewNotifications && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
            )}
          </button>
          {/* Notification Dropdown */}
          <div
            className={`absolute right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg transform transition-all duration-200 ease-out origin-top-right ${
              showNotificationDropdown
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="p-2 text-sm text-gray-600 dark:text-gray-300">
              No new notifications
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="relative" ref={userRef}>
          <button
            className="flex items-center space-x-2 bg-green-200 dark:bg-green-600 px-5 p-3 rounded-full gap-3 transition-colors duration-300"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <FaUserAlt className="h-6 w-6 text-gray-600 dark:text-gray-200" />
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              Hachib
            </span>
            <FaChevronDown className="text-gray-600 dark:text-gray-200" />
          </button>
          {/* User Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg transform transition-all duration-200 ease-out origin-top-right ${
              showUserDropdown
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={toggleTheme}
              className="flex items-center p-2 space-x-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full"
            >
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button className="flex items-center p-2 space-x-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserNav;
