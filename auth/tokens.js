const jwt = require("jsonwebtoken");
require("dotenv").config();
function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN, { expiresIn: "60m" });
}
function createRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
}
function sendAccessToken(req, res, accessToken) {
  res
    .status(200)
    .json({ accessToken ,message:"loggedIn"});
}
function sendRefreshToken(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh_token",
  });
}
function createAdminToken(adminToken){
  return jwt.sign({ adminToken }, process.env.ACCESS_TOKEN, { expiresIn: "60m"})
}
function createAdminRefreshToken(adminToken){
  return jwt.sign({ adminToken }, process.env.REFRESH_TOKEN, { expiresIn: "7d"})
}
function sendAdminToken(res,adminToken){
  return res.status(200).json({adminToken,message:"Welcome To Admin"})
} 
function sendAdminRefreshToken(res,AdRefreshToken){
  res.cookie("refreshToken",AdRefreshToken,{
    httpOnly:true,
    path:"refresh_token"
  })
}
module.exports = { createAccessToken, createRefreshToken,sendAccessToken,sendRefreshToken,createAdminRefreshToken,createAdminToken,sendAdminRefreshToken,sendAdminToken };
