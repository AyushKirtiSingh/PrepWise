const TestResult = require("../models/TestResult");
const User = require("../models/User");
const companyPatterns = require("../config/companyPatterns");

const getBank = () => require("../config/questionBank");

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildTest = (company) => {
  const bank = getBank();
  const pattern = companyPatterns[company] || companyPatterns["Google"];
  const selected = [];
  const usedIds = new Set();

  pattern.pattern.forEach(({ topic, type, count, difficulty }) => {
    // try exact match first
    let pool = bank.filter(q =>
      q.topic === topic &&
      q.type === type &&
      q.difficulty === difficulty &&
      !usedIds.has(q.id)
    );
    // relax difficulty if not enough
    if (pool.length < count) {
      pool = bank.filter(q =>
        q.topic === topic &&
        q.type === type &&
        !usedIds.has(q.id)
      );
    }
    // relax type if still not enough
    if (pool.length < count) {
      pool = bank.filter(q =>
        q.topic === topic &&
        !usedIds.has(q.id)
      );
    }

    const picked = shuffle(pool).slice(0, count);
    picked.forEach(q => { usedIds.add(q.id); selected.push(q); });
  });

  return { questions: shuffle(selected), pattern };
};

// ─── GET TEST PATTERN WITH ANSWERS ────────────────────
exports.getTestPatternWithAnswers = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const company = user.targetCompany;
    const { questions, pattern } = buildTest(company);

    res.status(200).json({
      company,
      duration: pattern.duration,
      totalQuestions: questions.length,
      description: pattern.description,
      tips: pattern.tips,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── SUBMIT TEST ──────────────────────────────────────
exports.submitTest = async (req, res) => {
  try {
    const userId = req.userId;
    const { answers, timeTaken, company } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    const totalQuestions = answers.length;
    const correct = answers.filter(a => a.isCorrect).length;
    const wrong = totalQuestions - correct;
    const score = correct;
    const accuracy = Math.round((correct / totalQuestions) * 100);

    const topicMap = {};
    answers.forEach(a => {
      if (!topicMap[a.topic]) topicMap[a.topic] = { topic: a.topic, correct: 0, total: 0 };
      topicMap[a.topic].total++;
      if (a.isCorrect) topicMap[a.topic].correct++;
    });
    const topicBreakdown = Object.values(topicMap);

    const level = accuracy >= 80 ? "advanced" : accuracy >= 50 ? "intermediate" : "beginner";

    const pastTests = await TestResult.find({ userId }).sort({ createdAt: -1 }).limit(3);

    const feedback = [];
    topicBreakdown.forEach(t => {
      const acc = Math.round((t.correct / t.total) * 100);
      if (acc >= 80) feedback.push(`Excellent on ${t.topic} — ${acc}% accuracy`);
      else if (acc >= 50) feedback.push(`${t.topic} needs more practice — ${acc}% accuracy`);
      else feedback.push(`Focus more on ${t.topic} — only ${acc}% accuracy`);
    });

    if (pastTests.length > 0) {
      const diff = accuracy - pastTests[0].accuracy;
      if (diff > 0) feedback.push(`Improved by ${diff}% since your last test!`);
      else if (diff < 0) feedback.push(`Score dropped by ${Math.abs(diff)}% since last test. Keep practicing!`);
      else feedback.push("Same score as last test. Push harder!");
    } else {
      feedback.push("This is your first test. Keep practicing to see your progress!");
    }

    const pattern = companyPatterns[company] || companyPatterns["Google"];
    const timeBonus = Math.min((pattern.duration / (timeTaken || pattern.duration)), 1);
    const readinessScore = Math.min(Math.round(accuracy * 0.7 + timeBonus * 30), 100);

    await TestResult.create({
      userId,
      testId: `test_${Date.now()}`,
      score, totalQuestions, accuracy,
      timeTaken, topicBreakdown, level,
      feedback: feedback.join(" | "),
      readinessScore,
    });

    res.status(201).json({
      message: "Test submitted successfully",
      result: {
        score, totalQuestions, correct, wrong,
        accuracy, level, readinessScore,
        timeTaken, topicBreakdown, feedback, company,
      },
      improvement: pastTests.length > 0 ? accuracy - pastTests[0].accuracy : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET ALL TEST RESULTS ─────────────────────────────
exports.getMyTests = async (req, res) => {
  try {
    const userId = req.userId;
    const tests = await TestResult.find({ userId }).sort({ createdAt: -1 });
    if (tests.length === 0) return res.status(200).json({ message: "No tests taken yet", tests: [] });

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
