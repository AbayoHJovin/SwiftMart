const express = require("express");
const { protectedRoute } = require("../adminControllers");

const router = express.Router();
router.post("/adminProtected",protectedRoute)

module.exports = router;
