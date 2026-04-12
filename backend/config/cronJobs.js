const cron = require("node-cron");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const User = require("../models/User");

const startCronJobs = () => {
  // runs every day at midnight 00:00
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily consistency check...");

    try {
      const today = new Date().toISOString().split("T")[0];

      // get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      // get all users
      const users = await User.find({});

      for (const user of users) {
        const userId = user._id;

        // check if user was active yesterday
        const yesterdayLog = await ActivityLog.findOne({
          userId,
          date: yesterdayStr,
        });

        const wasActiveYesterday = yesterdayLog && yesterdayLog.isActive;

        if (!wasActiveYesterday) {
          // find last active log
          const lastActiveLog = await ActivityLog.findOne({
            userId,
            isActive: true,
          }).sort({ date: -1 });

          // calculate inactive days
          let inactiveDays = 1;
          if (lastActiveLog) {
            const lastDate = new Date(lastActiveLog.date);
            const todayDate = new Date(today);
            const diffTime = Math.abs(todayDate - lastDate);
            inactiveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          // create inactive log for today
          await ActivityLog.create({
            userId,
            date: today,
            isActive: false,
            activitiesDone: [],
            currentStreak: 0,
            longestStreak: lastActiveLog ? lastActiveLog.longestStreak : 0,
            lastActiveDate: lastActiveLog ? lastActiveLog.date : null,
            inactiveDays,
          });

          // send notifications based on inactive days
          if (inactiveDays === 1) {
            await Notification.create({
              userId,
              message: "You missed yesterday's task. Stay consistent to reach your goal!",
              type: "warning",
            });
          } else if (inactiveDays === 3) {
            await Notification.create({
              userId,
              message: "You have been inactive for 3 days. Don't break your momentum!",
              type: "warning",
            });
          } else if (inactiveDays === 7) {
            await Notification.create({
              userId,
              message: "7 days inactive! Your goal is still waiting. Come back and start fresh!",
              type: "warning",
            });
          }

          console.log(`User ${user.name} inactive for ${inactiveDays} days`);
        } else {
          console.log(`User ${user.name} was active yesterday`);
        }
      }

      console.log("Daily consistency check complete");
    } catch (error) {
      console.log("Cron job error:", error.message);
    }
  });

  console.log("Cron jobs started");
};

module.exports = startCronJobs;
