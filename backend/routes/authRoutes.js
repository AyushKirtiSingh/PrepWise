const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// public routes — no login needed
router.post("/register", register);
router.post("/login", login);

// protected route — login required
// protect middleware runs first, then getProfile
router.get("/profile", protect, getProfile);

module.exports = router;