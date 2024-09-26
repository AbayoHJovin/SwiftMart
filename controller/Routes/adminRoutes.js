const express = require("express");
const { protectedRoute, logout, login, refreshToken } = require("../adminControllers");

const router = express.Router();
router.post("/adminProtected", protectedRoute);
router.post("/adminLogout", logout);
router.post("/adminLogin", login);
router.post("/refresh_admToken", refreshToken);
module.exports = router;
