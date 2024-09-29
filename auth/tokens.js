const jwt = require("jsonwebtoken");
require("dotenv").config();
function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN, { expiresIn: "60m" });
}
function createRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
}
function sendAccessToken(req, res, accessToken,isAdmin) {
  res
    .status(200)
    .json({ accessToken ,message:"loggedIn",isAdmin});
}
function sendRefreshToken(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh_token",
    secure:process.env.NODE_ENV === "production",
    sameSite:"Strict",
  });
}
module.exports = { createAccessToken, createRefreshToken,sendAccessToken,sendRefreshToken };
