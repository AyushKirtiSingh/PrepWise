const PracticeRecord = require("../models/PracticeRecord");

// load question bank fresh each call
const getQuestionBank = () => require("../config/questionBank");

// true shuffle using Fisher-Yates
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─── GET QUESTIONS ────────────────────────────────────
exports.getQuestions = async (req, res) => {
  try {
    const { topic, type, difficulty } = req.query;
    const bank = getQuestionBank();
    let pool = [...bank];

    if (topic && topic !== "all") {
      pool = pool.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    }
    if (type && type !== "all") {
      pool = pool.filter(q => q.type === type);
    }
    if (difficulty && difficulty !== "all") {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    // true random shuffle then pick 10
    const shuffled = shuffle(pool);
    const picked = shuffled.slice(0, Math.min(10, shuffled.length));

    // never send answer to frontend
    const safe = picked.map(({ answer, hint, ...q }) => q);

    res.status(200).json({ questions: safe, total: safe.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── SUBMIT ANSWER ────────────────────────────────────
exports.submitAnswer = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId, userAnswerIndex, topic, type, difficulty, timeTaken } = req.body;

    const bank = getQuestionBank();
    const question = bank.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const isCorrect = Number(userAnswerIndex) === question.answer;

    await PracticeRecord.create({
      userId,
      questionId,
      topic: topic || question.topic,
      type: type || question.type,
      isCorrect,
      timeTaken: Number(timeTaken) || 0,
      userAnswer: question.options[userAnswerIndex],
      correctAnswer: question.options[question.answer],
      difficulty: difficulty || question.difficulty,
    });

    res.status(200).json({
      isCorrect,
      correctAnswer: question.options[question.answer],
      explanation: isCorrect
        ? `Correct! ${question.hint || "Well done."}`
        : `Wrong. Correct answer: ${question.options[question.answer]}. ${question.hint || ""}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET ALL PRACTICE RECORDS ─────────────────────────
exports.getMyPractice = async (req, res) => {
  try {
    const userId = req.userId;
    const records = await PracticeRecord.find({ userId }).sort({ createdAt: -1 });
    const total = records.length;
    const correct = records.filter(r => r.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    res.status(200).json({ total, correct, wrong: total - correct, accuracy, records });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET TOPIC ANALYSIS ───────────────────────────────
exports.getTopicAnalysis = async (req, res) => {
  try {
    const userId = req.userId;
    const records = await PracticeRecord.find({ userId });
    if (records.length === 0) return res.status(200).json({ topicAnalysis: [] });

    const topicMap = {};
    records.forEach(r => {
      if (!topicMap[r.topic]) topicMap[r.topic] = { total: 0, correct: 0 };
      topicMap[r.topic].total++;
      if (r.isCorrect) topicMap[r.topic].correct++;
    });

    const topicAnalysis = Object.keys(topicMap).map(topic => {
      const { total, correct } = topicMap[topic];
      const accuracy = Math.round((correct / total) * 100);
      return {
        topic, total, correct,
        wrong: total - correct,
        accuracy,
        status: accuracy >= 80 ? "strong" : accuracy >= 50 ? "average" : "weak",
      };
    }).sort((a, b) => b.accuracy - a.accuracy);

    res.status(200).json({
      topicAnalysis,
      strongTopics: topicAnalysis.filter(t => t.status === "strong").map(t => t.topic),
      weakTopics: topicAnalysis.filter(t => t.status === "weak").map(t => t.topic),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
