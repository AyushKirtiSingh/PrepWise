const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    degree: {
      type: String,
      required: true,
      enum: ["BTech", "BCA", "BCom", "BSc", "MCA", "MBA", "Other"],
    },
    background: {
      type: String,
      required: true,
      enum: ["technical", "non-technical"],
    },
    skills: {
      type: [String],
      default: [],
    },
    careerGoal: {
      type: String,
      required: true,
    },
    targetCompany: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// only one index definition — removed duplicate
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
