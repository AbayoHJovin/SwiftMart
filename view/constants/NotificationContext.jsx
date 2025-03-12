import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CurrentUserContext } from './currentUser';
import { apiUrl } from '../src/lib/apis';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const { currentUser } = useContext(CurrentUserContext);
    const [notificationSound] = useState(new Audio('/notification-sound.mp3'));

    // Get the appropriate token based on user role
    const getAuthToken = useCallback(() => {
        if (currentUser?.role === 'admin') {
            return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        }
        return localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    }, [currentUser]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const logOrderDetails = (orderDetails) => {
        console.group(`🛍️ New Order #${orderDetails.orderId}`);
        console.log('📅 Date:', new Date(orderDetails.orderInfo.date).toLocaleString());
        console.log('💰 Total:', formatCurrency(orderDetails.orderInfo.total));
        
        console.group('👤 Customer Details');
        console.log('Name:', orderDetails.customer.name);
        console.log('Email:', orderDetails.customer.email);
        console.log('Phone:', orderDetails.customer.phone);
        console.log('Address:', orderDetails.orderInfo.address);
        console.groupEnd();

        console.group('📦 Order Items');
        orderDetails.items.forEach(item => {
            console.log(`${item.name} x${item.quantity} - ${formatCurrency(item.price)}`);
        });
        console.groupEnd();

        console.log('💳 Payment Method:', orderDetails.orderInfo.paymentMethod);
        console.log('📊 Status:', orderDetails.orderInfo.status);
        console.groupEnd();
    };

    const fetchNotifications = useCallback(async () => {
        if (!currentUser?.userId) return;
        
        try {
            const token = getAuthToken();
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const response = await axios.get(`${apiUrl}/api/notifications/user/${currentUser.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data) {
                setNotifications(response.data);
                const unread = response.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response?.status === 401) {
                if (currentUser?.role === 'admin') {
                    localStorage.removeItem('adminToken');
                    sessionStorage.removeItem('adminToken');
                } else {
                    localStorage.removeItem('userToken');
                    sessionStorage.removeItem('userToken');
                }
            }
        }
    }, [currentUser, getAuthToken]);

    // Initialize socket connection with auth token
    useEffect(() => {
        if (!currentUser?.userId) return;

        const token = getAuthToken();
        if (!token) return;

        const newSocket = io('http://localhost:5000', {
            auth: {
                token: token
            }
        });
        
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [currentUser, getAuthToken]);

    // Handle socket authentication and events
    useEffect(() => {
        if (!socket || !currentUser?.userId) return;

        const handleSocketError = (error) => {
            console.error('Socket connection error:', error);
            if (error.message === 'Invalid token') {
                socket.disconnect();
                if (currentUser?.role === 'admin') {
                    localStorage.removeItem('adminToken');
                    sessionStorage.removeItem('adminToken');
                } else {
                    localStorage.removeItem('userToken');
                    sessionStorage.removeItem('userToken');
                }
            }
        };

        socket.on('connect_error', handleSocketError);

        if (currentUser.role === 'admin') {
            socket.emit('authenticateAdmin', { token: getAuthToken() });
            
            socket.on('newOrder', (notification) => {
                notificationSound.play().catch(err => console.log('Sound play error:', err));
                
                // Log detailed order information
                if (notification.orderDetails) {
                    logOrderDetails(notification.orderDetails);
                }
                
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        } else {
            socket.emit('authenticateUser', { 
                userId: currentUser.userId,
                token: getAuthToken()
            });
            
            socket.on('orderNotification', (notification) => {
                notificationSound.play().catch(err => console.log('Sound play error:', err));
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }

        return () => {
            socket.off('connect_error');
            socket.off('newOrder');
            socket.off('orderNotification');
        };
    }, [socket, currentUser, getAuthToken, notificationSound]);

    const markAsRead = async (notificationId) => {
        try {
            const token = getAuthToken();
            if (!token) return;

            await axios.put(`${apiUrl}/api/notifications/${notificationId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            if (error.response?.status === 401) {
                // Handle token expiration
                if (currentUser?.role === 'admin') {
                    localStorage.removeItem('adminToken');
                    sessionStorage.removeItem('adminToken');
                } else {
                    localStorage.removeItem('userToken');
                    sessionStorage.removeItem('userToken');
                }
            }
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            await Promise.all(
                notifications
                    .filter(n => !n.isRead)
                    .map(n => 
                        axios.put(`${apiUrl}/api/notifications/${n.id}/read`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    )
            );
            
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            if (error.response?.status === 401) {
                // Handle token expiration
                if (currentUser?.role === 'admin') {
                    localStorage.removeItem('adminToken');
                    sessionStorage.removeItem('adminToken');
                } else {
                    localStorage.removeItem('userToken');
                    sessionStorage.removeItem('userToken');
                }
            }
        }
    };

    useEffect(() => {
        if (currentUser?.userId) {
            fetchNotifications();
        }
    }, [currentUser, fetchNotifications]);

    const value = {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        getAuthToken
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}; 