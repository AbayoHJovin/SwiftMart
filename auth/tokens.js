const jwt = require("jsonwebtoken");
require("dotenv").config();

function createAccessToken(userId, role = 'user') {
    return jwt.sign(
        { userId, role }, 
        process.env.ACCESS_TOKEN, 
        { expiresIn: "1h" }
    );
}

function createRefreshToken(userId, role = 'user') {
    return jwt.sign(
        { userId, role }, 
        process.env.REFRESH_TOKEN, 
        { expiresIn: "7d" }
    );
}

function setTokenCookies(res, { accessToken, refreshToken, isAdmin, user }) {
    // Set access token cookie
    const accessTokenKey = isAdmin ? 'adminToken' : 'userToken';
    res.cookie(accessTokenKey, accessToken, {
        httpOnly: false, // Allow JavaScript access
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000 // 1 hour
    });

    // Set refresh token cookie
    const refreshTokenKey = isAdmin ? 'adminRefreshToken' : 'userRefreshToken';
    res.cookie(refreshTokenKey, refreshToken, {
        httpOnly: true,
        path: '/refresh_token',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return response data
    return {
        success: true,
        accessToken,
        user: {
            ...user,
            role: isAdmin ? 'admin' : 'user'
        },
        isAdmin
    };
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    setTokenCookies
};
