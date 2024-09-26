const { verify } = require("jsonwebtoken");
const jwt=require("jsonwebtoken")
const {
  createAdminToken,
  createAdminRefreshToken,
  sendAdminRefreshToken,
  sendAdminToken,
} = require("../auth/tokens");
function isAuth(authorization) {
  try {
    const token = authorization;
    const { adminToken } = verify(token, process.env.ACCESS_TOKEN);
    return adminToken;
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
}
require("dotenv").config();
exports.login = async (req, res) => {
  const { email, password, Token } = req.body;
  try {
    if (!email || !password || !Token) {
      throw new Error("Please enter all credentials");
    }
    const adminEmail = process.env.AD_EMAIL;
    const adminPassword = process.env.AD_PASSWORD;
    const adminToken = process.env.AD_KEY;
    if (
      adminEmail !== email ||
      adminPassword !== password ||
      adminToken !== Token
    ) {
      throw new Error("Incorrect credentials");
    }
    const accessToken = createAdminToken(Token);
    const refreshToken = createAdminRefreshToken(Token);
    sendAdminRefreshToken(res, refreshToken);
    sendAdminToken(res, accessToken);
    return;
  } catch (e) {
    return res.status(401).json({ message: e.message || "Unauthorized" });
  }
};
exports.logout = async (req, res) => {
  res.clearCookie("refreshToken", { path: "/refresh_token" });
  return res.send({ message: "Logged out" });
};

exports.protectedRoute = (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "no token" });
  const adminToken = isAuth(token);
  if (!adminToken) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  return res.status(200).json({ message: "Authorized" });
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.send({ adminToken: "No token" });
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN);
    if (!payload.adminToken) {
      return res.send({ adminToken: "" });
    }
  } catch (e) {
    return res.send({ adminToken:e.message || "" });
  }
  const adminToken = createAdminToken(process.env.AD_KEY);
  const refreshToken = createAdminRefreshToken(process.env.AD_KEY);
  sendAdminRefreshToken(res, refreshToken);
  return res.send({ adminToken: adminToken });
};
