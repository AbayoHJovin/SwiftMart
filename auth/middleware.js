const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    throw new Error("Access Denied");
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      throw new Error("Access Denied");
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Access Denied" });
  }
};
