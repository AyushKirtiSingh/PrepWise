const express = require("express");
const router = express.Router();
const { getTestPatternWithAnswers, submitTest, getMyTests } = require("../controllers/mockTestController");
const protect = require("../middleware/authMiddleware");

router.get("/pattern", protect, getTestPatternWithAnswers);
router.post("/submit", protect, submitTest);
router.get("/", protect, getMyTests);

module.exports = router;
