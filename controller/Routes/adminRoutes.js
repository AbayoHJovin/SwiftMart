const express = require("express");
const { protectedRoute, logout, login } = require("../adminControllers");

const router = express.Router();
router.post("/adminProtected",protectedRoute)
router.post("/adminLogout",logout)
router.post("/adminLogin",login)
module.exports = router;
