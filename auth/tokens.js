const jwt = require("jsonwebtoken");
require("dotenv").config();
function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN, { expiresIn: "60m" });
}
function createRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
}
function sendAccessToken(req, res, accessToken, isAdmin) {
  res.status(200).json({ accessToken, message: "loggedIn", isAdmin });
}
function sendRefreshToken(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh_token",
    secure: process.env.NODE_ENV === "production", // Ensures it's sent only over HTTPS in production
    sameSite: "None", // None for cross-domain cookies
    maxAge: 1000 * 60 * 60 * 24 * 7, // Optional: set an expiry of 7 days
  });
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};
