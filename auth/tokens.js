const jwt = require("jsonwebtoken");
require("dotenv").config();
function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
}
function createRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
}
function sendAccessToken(req, res, accessToken, user) {
  res
    .status(200)
    .json({ accessToken, email: user.email, username: user.username,_id:user._id });
}
function sendRefreshToken(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh_token",
  });
}
module.exports = { createAccessToken, createRefreshToken,sendAccessToken,sendRefreshToken };
