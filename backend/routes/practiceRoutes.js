const express = require("express");
const router = express.Router();
const { getQuestions, submitAnswer, getMyPractice, getTopicAnalysis } = require("../controllers/practiceController");
const protect = require("../middleware/authMiddleware");

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitAnswer);
router.get("/", protect, getMyPractice);
router.get("/topics", protect, getTopicAnalysis);

module.exports = router;
