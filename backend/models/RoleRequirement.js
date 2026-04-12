const mongoose = require("mongoose");

const roleRequirementSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,            // e.g. "Google"
    },

    role: {
      type: String,
      required: true,
      trim: true,            // e.g. "Software Engineer"
    },

    requiredDegrees: {
      type: [String],        // e.g. ["BTech", "MCA"]
      required: true,
    },

    requiredSkills: {
      type: [String],        // e.g. ["DSA", "OS", "DBMS", "System Design"]
      required: true,
    },

    minCGPA: {
      type: Number,
      default: 0,            // 0 means no CGPA requirement
    },

    background: {
      type: String,
      enum: ["technical", "non-technical", "any"],
      default: "any",
    },

    description: {
      type: String,          // optional short role description
    },
  },
  {
    timestamps: true,
  }
);

// INDEX — eligibility engine queries by company + role together
// compound index: searches "Google" + "SWE" as a single fast lookup
roleRequirementSchema.index({ company: 1, role: 1 });

module.exports = mongoose.model("RoleRequirement", roleRequirementSchema);