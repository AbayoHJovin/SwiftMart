const express = require("express");
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
} = require("../userControllers");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/users", getUserDetails);
router.patch("/user/update", updateUserDetails);
router.post("/logout", logOut);
router.get("/currentUser", getCurrentUser);
router.patch("/forgotPass",forgotPassword)
router.get("/checkPassword",checkOldPassword)
router.patch("/updatePassword",updatePassword)

module.exports = router;
