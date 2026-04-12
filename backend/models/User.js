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
      unique: true,          // no two users can have same email
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      // never store plain text — always hash before saving (bcrypt)
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
      type: [String],        // array of skill strings e.g. ["DSA", "Python"]
      default: [],
    },

    careerGoal: {
      type: String,          // e.g. "Software Engineer"
      required: true,
    },

    targetCompany: {
      type: String,          // e.g. "Google"
      required: true,
    },

    targetRole: {
      type: String,          // e.g. "SWE"
      required: true,
    },
  },
  {
    timestamps: true,        // auto adds createdAt and updatedAt fields
  }
);

// INDEX — we search users by email during login
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);