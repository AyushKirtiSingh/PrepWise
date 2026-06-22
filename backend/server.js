const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const practiceRoutes = require("./routes/practiceRoutes");
const mockTestRoutes = require("./routes/mockTestRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const consistencyRoutes = require("./routes/consistencyRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/skillgap", skillGapRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/mocktest", mockTestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/consistency", consistencyRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "PrepWise backend is running" });
});

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // start cron jobs after DB connects
    const startCronJobs = require("./config/cronJobs");
    startCronJobs();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
  });
