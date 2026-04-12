const TestResult = require("../models/TestResult");
const User = require("../models/User");

// ─── SUBMIT TEST ──────────────────────────────────────
exports.submitTest = async (req, res) => {
  try {
    const userId = req.userId;
    const { testId, answers, timeTaken } = req.body;
    // answers format:
    // [{ questionId, topic, isCorrect }]

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    // 1. calculate overall score
    const totalQuestions = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const wrong = totalQuestions - correct;
    const score = correct;
    const accuracy = Math.round((correct / totalQuestions) * 100);

    // 2. build topic breakdown
    const topicMap = {};
    answers.forEach((a) => {
      if (!topicMap[a.topic]) {
        topicMap[a.topic] = { topic: a.topic, correct: 0, total: 0 };
      }
      topicMap[a.topic].total++;
      if (a.isCorrect) topicMap[a.topic].correct++;
    });
    const topicBreakdown = Object.values(topicMap);

    // 3. detect level based on accuracy
    const level =
      accuracy >= 80 ? "advanced" :
      accuracy >= 50 ? "intermediate" : "beginner";

    // 4. get past tests for comparison
    const pastTests = await TestResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    // 5. generate feedback
    let feedback = [];

    // topic wise feedback
    topicBreakdown.forEach((t) => {
      const topicAccuracy = Math.round((t.correct / t.total) * 100);
      if (topicAccuracy >= 80) {
        feedback.push(`Great job on ${t.topic} — ${topicAccuracy}% accuracy`);
      } else if (topicAccuracy >= 50) {
        feedback.push(`${t.topic} needs more practice — ${topicAccuracy}% accuracy`);
      } else {
        feedback.push(`Focus more on ${t.topic} — only ${topicAccuracy}% accuracy`);
      }
    });

    // comparison with last test
    if (pastTests.length > 0) {
      const lastTest = pastTests[0];
      if (accuracy > lastTest.accuracy) {
        feedback.push(`You improved by ${accuracy - lastTest.accuracy}% since your last test`);
      } else if (accuracy < lastTest.accuracy) {
        feedback.push(`Your score dropped by ${lastTest.accuracy - accuracy}% since your last test. Keep practicing!`);
      } else {
        feedback.push("Same score as your last test. Push harder!");
      }
    } else {
      feedback.push("This is your first test. Keep practicing to see your progress!");
    }

    // 6. calculate readiness score
    const readinessScore = Math.round(
      (accuracy * 0.6) + (Math.min(timeTaken ? 1800 / timeTaken : 1, 1) * 40)
    );

    // 7. save test result
    const testResult = await TestResult.create({
      userId,
      testId: testId || `test_${Date.now()}`,
      score,
      totalQuestions,
      accuracy,
      timeTaken,
      topicBreakdown,
      level,
      feedback: feedback.join(" | "),
      readinessScore: Math.min(readinessScore, 100),
    });

    // 8. send response
    res.status(201).json({
      message: "Test submitted successfully",
      result: {
        score,
        totalQuestions,
        correct,
        wrong,
        accuracy,
        level,
        readinessScore: Math.min(readinessScore, 100),
        timeTaken,
        topicBreakdown,
        feedback,
      },
      // comparison with past tests
      improvement:
        pastTests.length > 0
          ? accuracy - pastTests[0].accuracy
          : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET ALL TEST RESULTS ─────────────────────────────
exports.getMyTests = async (req, res) => {
  try {
    const userId = req.userId;

    const tests = await TestResult.find({ userId })
      .sort({ createdAt: -1 });

    if (tests.length === 0) {
      return res.status(200).json({
        message: "No tests taken yet",
        tests: [],
      });
    }

    // calculate trend
    const latestAccuracy = tests[0].accuracy;
    const oldestAccuracy = tests[tests.length - 1].accuracy;
    const trend = latestAccuracy - oldestAccuracy;

    res.status(200).json({
      totalTests: tests.length,
      latestAccuracy,
      trend: trend > 0 ? "improving" : trend < 0 ? "declining" : "stable",
      trendValue: trend,
      tests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET SINGLE TEST RESULT ───────────────────────────
exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await TestResult.findOne({
      testId,
      userId: req.userId,
    });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json({ test });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
