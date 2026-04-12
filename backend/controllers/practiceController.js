const PracticeRecord = require("../models/PracticeRecord");

// ─── LOG A PRACTICE ATTEMPT ───────────────────────────
exports.logPractice = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      questionId,
      topic,
      type,
      isCorrect,
      timeTaken,
      userAnswer,
      correctAnswer,
      difficulty,
    } = req.body;

    const record = await PracticeRecord.create({
      userId,
      questionId,
      topic,
      type,
      isCorrect,
      timeTaken,
      userAnswer,
      correctAnswer,
      difficulty,
    });

    res.status(201).json({
      message: "Practice record saved",
      record,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET ALL PRACTICE RECORDS FOR USER ────────────────
exports.getMyPractice = async (req, res) => {
  try {
    const userId = req.userId;

    const records = await PracticeRecord.find({ userId })
      .sort({ createdAt: -1 });

    // calculate overall stats
    const total = records.length;
    const correct = records.filter((r) => r.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    res.status(200).json({
      total,
      correct,
      wrong: total - correct,
      accuracy,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET TOPIC WISE PERFORMANCE ───────────────────────
exports.getTopicAnalysis = async (req, res) => {
  try {
    const userId = req.userId;

    const records = await PracticeRecord.find({ userId });

    if (records.length === 0) {
      return res.status(200).json({
        message: "No practice records found",
        topicAnalysis: [],
      });
    }

    // group records by topic
    const topicMap = {};
    records.forEach((record) => {
      if (!topicMap[record.topic]) {
        topicMap[record.topic] = { total: 0, correct: 0 };
      }
      topicMap[record.topic].total++;
      if (record.isCorrect) topicMap[record.topic].correct++;
    });

    // build topic analysis array
    const topicAnalysis = Object.keys(topicMap).map((topic) => {
      const { total, correct } = topicMap[topic];
      const accuracy = Math.round((correct / total) * 100);
      return {
        topic,
        total,
        correct,
        wrong: total - correct,
        accuracy,
        status:
          accuracy >= 80 ? "strong" :
          accuracy >= 50 ? "average" : "weak",
      };
    });

    // sort by accuracy descending
    topicAnalysis.sort((a, b) => b.accuracy - a.accuracy);

    const strongTopics = topicAnalysis.filter((t) => t.status === "strong");
    const weakTopics = topicAnalysis.filter((t) => t.status === "weak");

    res.status(200).json({
      topicAnalysis,
      strongTopics: strongTopics.map((t) => t.topic),
      weakTopics: weakTopics.map((t) => t.topic),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
