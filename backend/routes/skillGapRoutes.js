const express = require("express");
const router = express.Router();
const { getSkillGap } = require("../controllers/skillGapController");
const protect = require("../middleware/authMiddleware");

router.get("/analyze", protect, getSkillGap);

module.exports = router;
