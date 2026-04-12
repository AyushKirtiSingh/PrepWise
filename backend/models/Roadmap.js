const mongoose = require("mongoose");

// sub-schema for each day's plan
const dayPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,        // day number e.g. 1, 2, 3...
    },

    topic: {
      type: String,
      required: true,        // e.g. "Arrays & Strings"
    },

    tasks: {
      type: [String],        // e.g. ["reverse array", "two pointer problems"]
      default: [],
    },

    isCompleted: {
      type: Boolean,
      default: false,        // user marks this true when done
    },
  },
  { _id: false }             // no separate _id for each day sub-document
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",           // reference to Users collection
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    targetCompany: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    background: {
      type: String,
      enum: ["technical", "non-technical"],
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,        // total length of the plan e.g. 30 days
    },

    plan: {
      type: [dayPlanSchema], // array of day-wise plans
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// INDEX — fetch roadmap for a specific user
roadmapSchema.index({ userId: 1 });

module.exports = mongoose.model("Roadmap", roadmapSchema);