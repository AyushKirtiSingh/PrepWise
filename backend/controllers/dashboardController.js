const User = require("../models/User");
const PracticeRecord = require("../models/PracticeRecord");
const TestResult = require("../models/TestResult");
const Roadmap = require("../models/Roadmap");
const ActivityLog = require("../models/ActivityLog");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. get user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. get practice stats
    const practiceRecords = await PracticeRecord.find({ userId });
    const totalPractice = practiceRecords.length;
    const correctPractice = practiceRecords.filter((r) => r.isCorrect).length;
    const practiceAccuracy =
      totalPractice > 0
        ? Math.round((correctPractice / totalPractice) * 100)
        : 0;

    // topic wise breakdown from practice
    const topicMap = {};
    practiceRecords.forEach((r) => {
      if (!topicMap[r.topic]) {
        topicMap[r.topic] = { total: 0, correct: 0 };
      }
      topicMap[r.topic].total++;
      if (r.isCorrect) topicMap[r.topic].correct++;
    });
    const topicAnalysis = Object.keys(topicMap).map((topic) => {
      const { total, correct } = topicMap[topic];
      const accuracy = Math.round((correct / total) * 100);
      return {
        topic,
        accuracy,
        status:
          accuracy >= 80 ? "strong" :
          accuracy >= 50 ? "average" : "weak",
      };
    });
    const strongTopics = topicAnalysis
      .filter((t) => t.status === "strong")
      .map((t) => t.topic);
    const weakTopics = topicAnalysis
      .filter((t) => t.status === "weak")
      .map((t) => t.topic);

    // 3. get test stats
    const tests = await TestResult.find({ userId })
      .sort({ createdAt: -1 });
    const totalTests = tests.length;
    const latestTest = tests[0] || null;
    const latestAccuracy = latestTest ? latestTest.accuracy : 0;
    const latestLevel = latestTest ? latestTest.level : "beginner";

    // calculate test trend
    let trend = "stable";
    let trendValue = 0;
    if (tests.length >= 2) {
      trendValue = tests[0].accuracy - tests[1].accuracy;
      trend =
        trendValue > 0 ? "improving" :
        trendValue < 0 ? "declining" : "stable";
    }

    // 4. get roadmap progress
    const roadmap = await Roadmap.findOne({ userId });
    let roadmapProgress = 0;
    let completedDays = 0;
    let totalDays = 0;
    if (roadmap) {
      totalDays = roadmap.totalDays;
      completedDays = roadmap.plan.filter((p) => p.isCompleted).length;
      roadmapProgress = Math.round((completedDays / totalDays) * 100);
    }

    // 5. get activity log for streak
    const today = new Date().toISOString().split("T")[0];
    const activityLog = await ActivityLog.findOne({ userId, date: today });
    const currentStreak = activityLog ? activityLog.currentStreak : 0;

    // 6. calculate overall readiness score
    // weighted: 40% test accuracy + 30% practice accuracy + 30% roadmap progress
    const readinessScore = Math.round(
      latestAccuracy * 0.4 +
      practiceAccuracy * 0.3 +
      roadmapProgress * 0.3
    );

    // 7. send full dashboard response
    res.status(200).json({
      user: {
        name: user.name,
        targetCompany: user.targetCompany,
        targetRole: user.targetRole,
        degree: user.degree,
        background: user.background,
      },
      readinessScore,
      readinessMessage: `You are ${readinessScore}% ready for ${user.targetRole} at ${user.targetCompany}`,
      practiceStats: {
        totalSolved: totalPractice,
        correct: correctPractice,
        wrong: totalPractice - correctPractice,
        accuracy: practiceAccuracy,
      },
      testStats: {
        totalTests,
        latestAccuracy,
        latestLevel,
        trend,
        trendValue,
        latestFeedback: latestTest ? latestTest.feedback : null,
      },
      skillInsights: {
        strongTopics,
        weakTopics,
        topicAnalysis,
      },
      roadmapProgress: {
        completedDays,
        totalDays,
        progressPercent: roadmapProgress,
      },
      consistencyStats: {
        currentStreak,
        lastActive: activityLog ? activityLog.date : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
