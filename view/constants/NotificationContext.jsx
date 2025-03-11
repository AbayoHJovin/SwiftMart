import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CurrentUserContext } from './currentUser';
import { apiUrl } from '../src/lib/apis';

export const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { currentUser } = useContext(CurrentUserContext);

    const fetchNotifications = async () => {
        if (!currentUser?.userId) return;
        
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get(`${apiUrl}/api/notifications/user/${currentUser.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
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
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            await axios.put(`${apiUrl}/api/notifications/${notificationId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        if (currentUser?.userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [currentUser]);

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