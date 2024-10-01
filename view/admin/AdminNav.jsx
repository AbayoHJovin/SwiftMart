/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaUserAlt, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const Header = ({currentBar}) => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

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

  return (
    <header className="flex items-center justify-between bg-gray-100 p-4">
      {/* Search Bar */}
      <div className="flex-1 font-bold text-lg max-w-md">
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
            <FaBell className="h-6 w-6 text-gray-600" />
            {/* Show badge if there are new notifications */}
            {hasNewNotifications && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
            )}
          </button>
          {/* Notification Dropdown */}
          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2 text-sm text-gray-600">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="top-0 sticky" ref={userRef}>
          <button
            className="flex items-center space-x-2 bg-green-200 px-5 p-3 rounded-full gap-3"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <FaUserAlt className="h-6 w-6 text-gray-600" />
            <span className="text-gray-800 font-medium">Hachib</span>
            <FaChevronDown />
          </button>
          {/* User Dropdown */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <button className="flex items-center p-2 space-x-2 text-gray-600 hover:bg-gray-100 w-full">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
