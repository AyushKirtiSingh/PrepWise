const mongoose = require("mongoose");

// sub-schema for per-topic breakdown inside a test
const topicBreakdownSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,        // e.g. "DSA"
    },
    correct: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testId: {
      type: String,
      required: true,        // unique ID for this test session
    },

    score: {
      type: Number,
      required: true,        // raw score e.g. 72
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,          // percentage e.g. 85.5
      required: true,
    },

    timeTaken: {
      type: Number,          // total seconds taken for the test
    },

    topicBreakdown: {
      type: [topicBreakdownSchema],  // array of per-topic results
      default: [],
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      // detected level AFTER this test result
    },

    feedback: {
      type: String,          // e.g. "Focus more on DBMS"
    },

    readinessScore: {
      type: Number,          // e.g. 72 — "72% ready for Amazon"
    },
  },
  {
    timestamps: true,        // takenAt = createdAt
  }
);

// INDEX — fetch all test results for a user (dashboard + comparison)
testResultSchema.index({ userId: 1 });

// INDEX — fetch results sorted by date for trend analysis
// -1 means descending (latest first)
testResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("TestResult", testResultSchema);