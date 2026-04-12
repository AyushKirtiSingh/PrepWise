const express = require("express");
const router = express.Router();
const {
  submitTest,
  getMyTests,
  getTestById,
} = require("../controllers/mockTestController");
const protect = require("../middleware/authMiddleware");

// submit a completed test
router.post("/submit", protect, submitTest);

// get all test results
router.get("/", protect, getMyTests);

// get single test result
router.get("/:testId", protect, getTestById);

module.exports = router;
