import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { apiUrl } from '../lib/apis';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    const fetchNotifications = async () => {
        if (!user?.userId) return;
        
        try {
            const response = await axios.get(`${apiUrl}/api/notifications/user/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setNotifications(response.data);
            const unread = response.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`${apiUrl}/api/notifications/${notificationId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        if (user?.userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [user]);

    const value = {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}; 