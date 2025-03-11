const express = require('express');
const router = express.Router();
const { 
    createOrder,
    approveOrder,
    updateApprovalMessage,
    deleteOrder,
    getUserOrders
} = require('../orderControllers');
const { verifyToken } = require('../../auth/verifyToken');

// Create a new order
router.post('/', verifyToken, createOrder);

// Get user's orders
router.get('/user/:userId', verifyToken, getUserOrders);

// Approve order
router.put('/:orderId/approve', verifyToken, approveOrder);

// Update approval message
router.put('/:orderId/approval-message', verifyToken, updateApprovalMessage);

// Delete order
router.delete('/:orderId', verifyToken, deleteOrder);

module.exports = router; 