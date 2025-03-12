const { verify } = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { createAccessToken } = require("./tokens");
const prisma = new PrismaClient();

// Token verification functions
async function verifyAccessToken(token) {
  try {
    const decoded = verify(token, process.env.ACCESS_TOKEN);
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function verifyRefreshToken(token) {
  try {
    const decoded = verify(token, process.env.REFRESH_TOKEN);
    // Verify token exists in database
    const user = await prisma.users.findFirst({
      where: { 
        userId: decoded.userId,
        refreshToken: token
      }
    });
    
    if (!user) {
      return { valid: false, error: 'Invalid refresh token' };
    }
    
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Direct token verification function (for internal use)
async function verifyToken(token) {
  try {
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    const { valid, data, error } = await verifyAccessToken(token);
    if (valid) {
      return { valid: true, data };
    }

    // If token is expired, return error
    return { valid: false, error };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Express middleware
async function authMiddleware(req, res, next) {
  try {
    // First check Authorization header
    const authHeader = req.headers.authorization;
    let accessToken = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;

    // If no Authorization header, check cookies
    if (!accessToken) {
      accessToken = req.cookies.userToken || req.cookies.adminToken;
    }

    const refreshToken = req.cookies.userRefreshToken || req.cookies.adminRefreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    // Try access token first
    if (accessToken) {
      const { valid, data, error } = await verifyAccessToken(accessToken);
      if (valid) {
        req.user = data;
        return next();
      }
      // Only proceed to refresh token if access token is expired
      if (error !== 'jwt expired') {
        return res.status(401).json({ 
          success: false,
          message: "Invalid access token" 
        });
      }
    }

    // Try refresh token
    if (refreshToken) {
      const { valid, data, error } = await verifyRefreshToken(refreshToken);
      if (!valid) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid refresh token" 
        });
      }

      // Create new access token
      const newAccessToken = createAccessToken(data.userId, data.role);
      
      // Set new access token cookie
      const tokenKey = data.role === 'admin' ? 'adminToken' : 'userToken';
      res.cookie(tokenKey, newAccessToken, {
        httpOnly: false,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000 // 1 hour
      });

      // Also set it in the response header
      res.set('Authorization', `Bearer ${newAccessToken}`);

      req.user = data;
      return next();
    }

    return res.status(401).json({ 
      success: false,
      message: "Authentication required" 
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
}

module.exports = {
  verifyToken,           // For direct token verification
  authMiddleware,        // Express middleware
  verifyAccessToken,     // For socket authentication
  verifyRefreshToken     // For token refresh
};