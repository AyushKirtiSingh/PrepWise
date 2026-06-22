const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  youtube: [{ title: String, channel: String, url: String }],
  practice: [{ title: String, url: String, source: String }],
}, { _id: false });

const dayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  topic: { type: String, required: true },
  tasks: { type: [String], default: [] },
  isCompleted: { type: Boolean, default: false },
  resources: { type: resourceSchema, default: null },
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetRole: { type: String, required: true },
  targetCompany: { type: String, required: true },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  background: { type: String, enum: ["technical", "non-technical"], required: true },
  totalDays: { type: Number, required: true },
  plan: { type: [dayPlanSchema], default: [] },
}, { timestamps: true });

roadmapSchema.index({ userId: 1 });

module.exports = mongoose.model("Roadmap", roadmapSchema);
