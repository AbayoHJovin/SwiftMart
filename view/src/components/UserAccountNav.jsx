/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaUserAlt, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import { apiUrl } from "../lib/apis";
import { toast, ToastContainer } from "react-toastify";
import NotificationComponent from './NotificationComponent';

const UserNav = ({ currentBar }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userRef = useRef();

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      })
      .catch(() => {
        toast.error("Can't logout!");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    <div className="flex items-center space-x-4">
      <NotificationComponent />
      
      <div className="relative" ref={userRef}>
        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
        >
          <FaUserAlt className="h-6 w-6" />
          <FaChevronDown className="h-4 w-4" />
        </button>

        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <FaUserAlt className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{currentUser?.username}</span>
              </div>
              <button
                className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserNav;
