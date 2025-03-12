const express = require("express");
const multer = require('multer');
require("dotenv").config()
const cloudinary = require("cloudinary").v2;
const { authMiddleware } = require("../../auth/isAuth");
const {
  signupUser,
  loginUser,
  getUserDetails,
  updateUserDetails,
  logOut,
  getCurrentUser,
  forgotPassword,
  checkOldPassword,
  updatePassword,
  checkUserEmail,
} = require("../userControllers");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/check-email", checkUserEmail);
router.patch("/forgotPass", forgotPassword);
router.patch("/updatePassword", updatePassword);

// Protected routes
router.get("/users", authMiddleware, getUserDetails);
router.patch("/user/update", authMiddleware, upload.single('image'), updateUserDetails);
router.post("/logout", authMiddleware, logOut);
router.get("/currentUser", authMiddleware, getCurrentUser);
router.get("/checkPassword", authMiddleware, checkOldPassword);

module.exports = router;
