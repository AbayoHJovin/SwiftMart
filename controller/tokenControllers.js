const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} = require("../auth/tokens");
const isAuth = require("../auth/isAuth")
require("dotenv").config();
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.send({ accessToken: "" });
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN);
  } catch (e) {
    return res.send({ accessToken: "" });
  }
  const user = await prisma.users.findUnique({
    where: { userId: payload.userId },
  });
  if (!user) {
    return res.send({ accessToken: "" });
  }
  const accessToken = createAccessToken(user.userId);
  const refreshToken = createRefreshToken(user.userId);
  sendRefreshToken(res, refreshToken);
  return res.send({ accessToken: accessToken });
};

exports.protectedRoute = async (req, res) => {
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
      const { valid, data } = await isAuth.verifyAccessToken(accessToken);
      if (valid) {
        return res.status(200).json({ 
          success: true,
          user: data
        });
      }
    }

    // Try refresh token if access token failed
    if (refreshToken) {
      const { valid, data } = await isAuth.verifyRefreshToken(refreshToken);
      if (valid) {
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

        return res.status(200).json({ 
          success: true,
          user: data,
          accessToken: newAccessToken
        });
      }
    }

    return res.status(401).json({ 
      success: false,
      message: "Invalid authentication" 
    });
  } catch (error) {
    console.error("Protected route error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};
