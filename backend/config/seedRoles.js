const mongoose = require("mongoose");
const dotenv = require("dotenv");
const RoleRequirement = require("../models/RoleRequirement");

dotenv.config();

const roles = [
  {
    company: "Google",
    role: "SWE",
    requiredDegrees: ["BTech", "MCA", "BSc"],
    requiredSkills: ["DSA", "System Design", "OS", "DBMS"],
    minCGPA: 7.0,
    background: "technical",
  },
  {
    company: "Amazon",
    role: "SWE",
    requiredDegrees: ["BTech", "MCA"],
    requiredSkills: ["DSA", "OS", "DBMS"],
    minCGPA: 6.5,
    background: "technical",
  },
  {
    company: "Google",
    role: "Data Analyst",
    requiredDegrees: ["BTech", "BCom", "BSc", "MBA"],
    requiredSkills: ["SQL", "Python", "Excel", "Statistics"],
    minCGPA: 6.0,
    background: "any",
  },
  {
    company: "Amazon",
    role: "Data Analyst",
    requiredDegrees: ["BTech", "BCom", "BSc"],
    requiredSkills: ["SQL", "Python", "Excel"],
    minCGPA: 6.0,
    background: "any",
  },
  {
    company: "Microsoft",
    role: "SWE",
    requiredDegrees: ["BTech", "MCA", "BSc"],
    requiredSkills: ["DSA", "OS", "DBMS", "System Design"],
    minCGPA: 7.0,
    background: "technical",
  },
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await RoleRequirement.deleteMany({});
    console.log("Cleared existing role requirements");
    await RoleRequirement.insertMany(roles);
    console.log("Role requirements seeded successfully");
    process.exit(0);
  } catch (error) {
    console.log("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedRoles();
