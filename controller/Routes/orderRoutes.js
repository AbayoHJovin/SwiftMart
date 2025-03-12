const express = require('express');
const router = express.Router();
const { 
    createOrder,
    approveOrder,
    updateApprovalMessage,
    deleteOrder,
    getUserOrders,
    getAllOrders
} = require('../orderControllers');
const { authMiddleware } = require('../../auth/isAuth');

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get all orders (admin only)
router.get('/all', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }
    next();
}, getAllOrders);

// Get user's orders
router.get('/user/:userId', authMiddleware, (req, res, next) => {
    if (req.user.userId === req.params.userId || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            message: 'Access denied' 
        });
    }
}, getUserOrders);

// Approve order (admin only)
router.put('/:orderId/approve', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }
    next();
}, approveOrder);

// Update approval message (admin only)
router.put('/:orderId/approval-message', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }
    next();
}, updateApprovalMessage);

// Delete order (admin only)
router.delete('/:orderId', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }
    next();
}, deleteOrder);

module.exports = router; 