const express = require("express");
const router = express.Router();
const {
  logPractice,
  getMyPractice,
  getTopicAnalysis,
} = require("../controllers/practiceController");
const protect = require("../middleware/authMiddleware");

// log a practice attempt
router.post("/log", protect, logPractice);

// get all practice records
router.get("/", protect, getMyPractice);

// get topic wise analysis
router.get("/topics", protect, getTopicAnalysis);

module.exports = router;
