const express = require("express");
const router = express.Router();
const {
  logActivity,
  getMyActivity,
  getNotifications,
  markAsRead,
} = require("../controllers/consistencyController");
const protect = require("../middleware/authMiddleware");

// log an activity
router.post("/log", protect, logActivity);

// get activity stats
router.get("/", protect, getMyActivity);

// get notifications
router.get("/notifications", protect, getNotifications);

// mark notification as read
router.patch("/notifications/:notificationId/read", protect, markAsRead);

module.exports = router;
