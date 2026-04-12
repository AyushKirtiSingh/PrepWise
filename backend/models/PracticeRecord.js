const mongoose = require("mongoose");

const practiceRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionId: {
      type: String,
      required: true,        // unique ID of the question attempted
    },

    topic: {
      type: String,
      required: true,        // e.g. "DSA", "DBMS", "OS", "HR"
    },

    type: {
      type: String,
      enum: ["coding", "MCQ", "HR"],
      required: true,
    },

    isCorrect: {
      type: Boolean,
      required: true,        // did user get it right?
    },

    timeTaken: {
      type: Number,          // time in seconds — displayed but not searched
    },

    userAnswer: {
      type: String,          // what the user submitted
    },

    correctAnswer: {
      type: String,          // stored for review later
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
  },
  {
    timestamps: true,        // attemptedAt = createdAt
  }
);

// INDEX — dashboard fetches all records for a user
practiceRecordSchema.index({ userId: 1 });

// INDEX — topic-wise performance analysis needs both userId + topic
// compound index for queries like: find({ userId: X, topic: "DSA" })
practiceRecordSchema.index({ userId: 1, topic: 1 });

module.exports = mongoose.model("PracticeRecord", practiceRecordSchema);