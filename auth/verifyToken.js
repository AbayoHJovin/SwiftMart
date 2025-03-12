const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // Check for token in various locations
    const authHeader = req.headers.authorization;
    const adminToken = req.cookies.adminToken || req.headers['admin-token'];
    const userToken = req.cookies.userToken || req.headers['user-token'];
    
    // Get token from Authorization header if present
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    
    // Use the appropriate token
    const token = bearerToken || adminToken || userToken || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info and token type to request
        req.user = decoded;
        req.tokenType = adminToken ? 'admin' : 'user';
        
        // For admin-only routes, check role
        if (req.adminRequired && decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware specifically for admin routes
const requireAdmin = (req, res, next) => {
    req.adminRequired = true;
    verifyToken(req, res, next);
};

module.exports = { verifyToken, requireAdmin }; 