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
        if (!currentUser) return null;
        
        // First try to get token from localStorage
        const token = localStorage.getItem('token');
        if (token) return token;

        // If no token in localStorage, check cookies
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        // Return the appropriate token based on user role
        return currentUser.role === 'admin' 
            ? cookies['adminToken'] 
            : cookies['userToken'];
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

    // Initialize socket connection
    useEffect(() => {
        if (!currentUser?.userId) return;

        const token = getAuthToken();
        if (!token) {
            console.warn('No authentication token found. Will retry in 2 seconds...');
            // Retry after 2 seconds in case tokens are still being set
            const retryTimeout = setTimeout(() => {
                const retryToken = getAuthToken();
                if (retryToken) {
                    initializeSocket(retryToken);
                } else {
                    console.error('Still no authentication token found after retry');
                }
            }, 2000);
            return () => clearTimeout(retryTimeout);
        }

        initializeSocket(token);

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [currentUser, getAuthToken]);

    // Helper function to initialize socket
    const initializeSocket = (token) => {
        // Create socket instance with auth token
        const newSocket = io('http://localhost:5000', {
            auth: { token },
            withCredentials: true,
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Handle socket events
        newSocket.on('connect', () => {
            console.log('Socket connected successfully');
            
            // Authenticate based on role
            if (currentUser.role === 'admin') {
                newSocket.emit('authenticateAdmin', { token });
            } else {
                newSocket.emit('authenticateUser', { 
                    userId: currentUser.userId,
                    token
                });
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        newSocket.on('auth_error', (error) => {
            console.error('Socket authentication error:', error.message);
            // Clear invalid token
            localStorage.removeItem('token');
        });

        setSocket(newSocket);
    };

    // Handle notifications
    useEffect(() => {
        if (!socket || !currentUser?.userId) return;

        // Listen for notifications based on role
        if (currentUser.role === 'admin') {
            socket.on('newOrder', (notification) => {
                console.log('New order notification received:', notification);
                notificationSound.play().catch(err => console.log('Sound play error:', err));
                if (notification.orderDetails) {
                    console.group('🛍️ New Order Details');
                    console.log('Order ID:', notification.orderDetails.orderId);
                    console.log('Customer:', notification.orderDetails.customer);
                    console.log('Total:', notification.orderDetails.orderInfo.total);
                    console.groupEnd();
                }
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            socket.on('unreadOrdersCount', ({ count }) => {
                setUnreadCount(count);
            });
        } else {
            socket.on('orderNotification', (notification) => {
                console.log('Order status notification received:', notification);
                notificationSound.play().catch(err => console.log('Sound play error:', err));
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            socket.on('unreadCount', ({ count }) => {
                setUnreadCount(count);
            });
        }

        return () => {
            socket.off('newOrder');
            socket.off('orderNotification');
            socket.off('unreadCount');
            socket.off('unreadOrdersCount');
        };
    }, [socket, currentUser, notificationSound]);

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
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                setNotifications(response.data.notifications);
                const unread = response.data.notifications.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            } else {
                console.error('Failed to fetch notifications:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                // Retry authentication after a short delay
                setTimeout(() => {
                    const retryToken = getAuthToken();
                    if (retryToken) {
                        fetchNotifications();
                    }
                }, 1000);
            }
        }
    }, [currentUser, getAuthToken]);

    const markAsRead = async (notificationId) => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await axios.put(`${apiUrl}/api/notifications/${notificationId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                setNotifications(prev => 
                    prev.map(notification => 
                        notification.id === notificationId 
                            ? { ...notification, isRead: true }
                            : notification
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                console.error('Failed to mark notification as read:', response.data.message);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
            }
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const unreadNotifications = notifications.filter(n => !n.isRead);
            
            const results = await Promise.allSettled(
                unreadNotifications.map(n => 
                    axios.put(`${apiUrl}/api/notifications/${n.id}/read`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    })
                )
            );
            
            const allSuccessful = results.every(result => 
                result.status === 'fulfilled' && result.value.data.success
            );

            if (allSuccessful) {
                setNotifications(prev => 
                    prev.map(notification => ({ ...notification, isRead: true }))
                );
                setUnreadCount(0);
            } else {
                console.error('Some notifications could not be marked as read');
                // Refresh notifications to get current state
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
            }
        }
    };

    // Fetch notifications on mount and when user changes
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