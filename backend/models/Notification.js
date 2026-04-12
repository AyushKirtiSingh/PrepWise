const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      // e.g. "You missed yesterday's task. Stay consistent!"
    },

    type: {
      type: String,
      enum: ["warning", "streak", "reminder", "achievement"],
      required: true,
      // warning   = inactivity alert
      // streak    = streak milestone reached
      // reminder  = gentle daily nudge
      // achievement = badge earned
    },

    isRead: {
      type: Boolean,
      default: false,        // false = unread (shows in bell icon count)
    },
  },
  {
    timestamps: true,        // createdAt tells us when it was sent
  }
);

// INDEX — fetch all notifications for a user
notificationSchema.index({ userId: 1 });

// INDEX — fetch only unread notifications for the bell icon count
// compound index: find({ userId: X, isRead: false })
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);