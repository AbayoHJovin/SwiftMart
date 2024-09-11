const { verify } = require("jsonwebtoken");

function isAuth(authorization) {
  try {
    const token = authorization
    const { userId } = verify(token, process.env.ACCESS_TOKEN);
    return userId;
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
}

module.exports = isAuth;