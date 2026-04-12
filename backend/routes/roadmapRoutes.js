const express = require("express");
const router = express.Router();
const {
  generateRoadmap,
  getRoadmap,
  completeDay,
} = require("../controllers/roadmapController");
const protect = require("../middleware/authMiddleware");

router.post("/generate", protect, generateRoadmap);
router.get("/", protect, getRoadmap);
router.patch("/complete/:day", protect, completeDay);

module.exports = router;
