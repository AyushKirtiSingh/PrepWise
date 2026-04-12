const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
      // stored as "YYYY-MM-DD" string e.g. "2025-04-10"
      // string format makes daily lookup simple and consistent
    },

    isActive: {
      type: Boolean,
      default: false,        // did the user do anything today?
    },

    activitiesDone: {
      type: [String],        // e.g. ["solved 3 questions", "took mock test"]
      default: [],
    },

    currentStreak: {
      type: Number,
      default: 0,            // consecutive active days right now
    },

    longestStreak: {
      type: Number,
      default: 0,            // best streak the user has ever hit
    },

    lastActiveDate: {
      type: String,          // "YYYY-MM-DD" of the last day user was active
    },

    inactiveDays: {
      type: Number,
      default: 0,            // how many days since last active — for alert logic
    },
  },
  {
    timestamps: true,
  }
);

// INDEX — consistency tracker fetches logs by userId every day
activityLogSchema.index({ userId: 1 });

// INDEX — daily cron job queries by userId + specific date
// compound index: find({ userId: X, date: "2025-04-10" })
activityLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);