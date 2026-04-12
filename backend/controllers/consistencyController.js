const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const User = require("../models/User");

// ─── LOG ACTIVITY (called whenever user does something) ───
exports.logActivity = async (req, res) => {
  try {
    const userId = req.userId;
    const { activity } = req.body;
    // activity = string e.g. "solved 3 questions"

    const today = new Date().toISOString().split("T")[0];

    // check if log exists for today
    let log = await ActivityLog.findOne({ userId, date: today });

    if (log) {
      // update existing log
      log.isActive = true;
      log.activitiesDone.push(activity);
      log.lastActiveDate = today;
      log.inactiveDays = 0;
      await log.save();
    } else {
      // get yesterday's log to calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const yesterdayLog = await ActivityLog.findOne({
        userId,
        date: yesterdayStr,
      });

      // calculate new streak
      const previousStreak = yesterdayLog ? yesterdayLog.currentStreak : 0;
      const wasActiveYesterday = yesterdayLog ? yesterdayLog.isActive : false;
      const newStreak = wasActiveYesterday ? previousStreak + 1 : 1;

      // get longest streak
      const allLogs = await ActivityLog.find({ userId })
        .sort({ currentStreak: -1 })
        .limit(1);
      const longestStreak = allLogs.length > 0
        ? Math.max(allLogs[0].currentStreak, newStreak)
        : newStreak;

      // create new log for today
      log = await ActivityLog.create({
        userId,
        date: today,
        isActive: true,
        activitiesDone: [activity],
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: today,
        inactiveDays: 0,
      });

      // send streak milestone notification
      if (newStreak === 3) {
        await Notification.create({
          userId,
          message: "You are on a 3 day streak! Keep it up!",
          type: "streak",
        });
      } else if (newStreak === 7) {
        await Notification.create({
          userId,
          message: "Amazing! 7 day streak achieved! You are on fire!",
          type: "streak",
        });
      } else if (newStreak === 30) {
        await Notification.create({
          userId,
          message: "Incredible! 30 day streak! You are unstoppable!",
          type: "achievement",
        });
      }
    }

    res.status(200).json({
      message: "Activity logged",
      date: today,
      currentStreak: log.currentStreak,
      activitiesDone: log.activitiesDone,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET MY ACTIVITY STATS ────────────────────────────
exports.getMyActivity = async (req, res) => {
  try {
    const userId = req.userId;

    // get last 7 days of activity
    const logs = await ActivityLog.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    const today = new Date().toISOString().split("T")[0];
    const todayLog = logs.find((l) => l.date === today);

    res.status(200).json({
      currentStreak: todayLog ? todayLog.currentStreak : 0,
      longestStreak: todayLog ? todayLog.longestStreak : 0,
      lastActiveDate: todayLog ? todayLog.lastActiveDate : null,
      last7Days: logs.map((l) => ({
        date: l.date,
        isActive: l.isActive,
        activitiesDone: l.activitiesDone,
        streak: l.currentStreak,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET MY NOTIFICATIONS ─────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json({
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── MARK NOTIFICATION AS READ ────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
