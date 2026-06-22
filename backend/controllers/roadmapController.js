const User = require("../models/User");
const RoleRequirement = require("../models/RoleRequirement");
const Roadmap = require("../models/Roadmap");
const roadmapResources = require("../config/roadmapResources");

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// default skills required if company/role not found in DB
const DEFAULT_REQUIRED_SKILLS = {
  "SWE": ["dsa", "system design", "os", "dbms"],
  "Data Analyst": ["sql", "python", "excel", "statistics"],
};

const topicContent = {
  dsa: {
    beginner: [
      { topic: "Arrays & Strings", tasks: ["reverse array", "two pointer", "sliding window"] },
      { topic: "Linked Lists", tasks: ["reverse linked list", "detect cycle", "merge lists"] },
      { topic: "Stacks & Queues", tasks: ["valid parentheses", "implement stack", "queue using stacks"] },
      { topic: "Trees", tasks: ["tree traversal", "height of tree", "binary search tree"] },
      { topic: "Graphs", tasks: ["BFS", "DFS", "detect cycle in graph"] },
      { topic: "Dynamic Programming", tasks: ["fibonacci", "0/1 knapsack", "longest common subsequence"] },
    ],
    intermediate: [
      { topic: "Arrays & Strings", tasks: ["kadanes algorithm", "trapping rain water", "merge intervals"] },
      { topic: "Trees", tasks: ["lowest common ancestor", "serialize tree", "balanced BST"] },
      { topic: "Graphs", tasks: ["dijkstra", "topological sort", "minimum spanning tree"] },
      { topic: "Dynamic Programming", tasks: ["matrix chain", "edit distance", "coin change"] },
    ],
  },
  "system design": {
    beginner: [
      { topic: "System Design Basics", tasks: ["scalability concepts", "load balancing", "caching"] },
      { topic: "Database Design", tasks: ["SQL vs NoSQL", "sharding", "replication"] },
      { topic: "API Design", tasks: ["REST principles", "rate limiting", "authentication"] },
    ],
    intermediate: [
      { topic: "System Design Basics", tasks: ["design URL shortener", "design Twitter feed", "design WhatsApp"] },
      { topic: "Database Design", tasks: ["consistent hashing", "CAP theorem", "database sharding"] },
      { topic: "API Design", tasks: ["GraphQL vs REST", "WebSockets", "API gateway"] },
    ],
  },
  os: {
    beginner: [
      { topic: "OS Basics", tasks: ["process vs thread", "memory management", "scheduling algorithms"] },
      { topic: "Deadlocks", tasks: ["conditions", "prevention", "banker algorithm"] },
      { topic: "Memory", tasks: ["paging", "segmentation", "virtual memory"] },
    ],
    intermediate: [
      { topic: "OS Basics", tasks: ["advanced scheduling", "file systems", "inode structure"] },
      { topic: "Deadlocks", tasks: ["detection algorithms", "recovery methods", "avoidance strategies"] },
      { topic: "Memory", tasks: ["page replacement algorithms", "thrashing", "segmentation faults"] },
    ],
  },
  dbms: {
    beginner: [
      { topic: "DBMS Basics", tasks: ["ER diagrams", "normalization", "keys and constraints"] },
      { topic: "SQL Queries", tasks: ["select join", "group by", "subqueries"] },
      { topic: "Transactions", tasks: ["ACID properties", "isolation levels", "deadlock in DB"] },
    ],
    intermediate: [
      { topic: "DBMS Basics", tasks: ["B+ tree index", "query optimization", "stored procedures"] },
      { topic: "SQL Queries", tasks: ["window functions", "CTEs", "complex joins"] },
      { topic: "Transactions", tasks: ["concurrency control", "two-phase locking", "MVCC"] },
    ],
  },
  sql: {
    beginner: [
      { topic: "SQL Queries", tasks: ["select", "where", "order by", "group by"] },
      { topic: "SQL Queries", tasks: ["inner join", "left join", "right join"] },
    ],
  },
  python: {
    beginner: [
      { topic: "OS Basics", tasks: ["Python basics", "OOP in Python", "Python libraries"] },
    ],
  },
  excel: {
    beginner: [
      { topic: "DBMS Basics", tasks: ["Excel formulas", "vlookup", "pivot tables"] },
    ],
  },
  statistics: {
    beginner: [
      { topic: "System Design Basics", tasks: ["mean median mode", "distributions", "hypothesis testing"] },
    ],
  },
};

const generatePlan = (missingSkills, level, background) => {
  const plan = [];
  let day = 1;

  if (background === "non-technical") {
    plan.push({ day: day++, topic: "Programming Basics", tasks: ["what is programming", "variables and data types", "control flow"], isCompleted: false, resources: null });
    plan.push({ day: day++, topic: "Python Introduction", tasks: ["install python", "first program", "basic syntax"], isCompleted: false, resources: null });
  }

  missingSkills.forEach(skill => {
    const key = skill.toLowerCase();
    const lvl = level === "advanced" ? "intermediate" : level;
    const content = topicContent[key]?.[lvl] || topicContent[key]?.["beginner"] || [];

    content.forEach(item => {
      plan.push({
        day: day++,
        topic: item.topic,
        tasks: item.tasks,
        isCompleted: false,
        resources: roadmapResources[item.topic] || null,
      });
    });

    plan.push({
      day: day++,
      topic: `${skill.toUpperCase()} Practice & Revision`,
      tasks: ["solve 5 problems", "revise notes", "take mini quiz"],
      isCompleted: false,
      resources: roadmapResources[`${skill.toUpperCase()} Practice & Revision`] || null,
    });
  });

  plan.push({ day: day++, topic: "Mock Interview Preparation", tasks: ["review all topics", "practice explaining solutions", "time yourself"], isCompleted: false, resources: roadmapResources["Mock Interview Preparation"] || null });
  plan.push({ day: day++, topic: "Final Revision", tasks: ["revise weak areas", "solve mixed problems", "mental preparation"], isCompleted: false, resources: null });

  return plan;
};

// ─── GENERATE ROADMAP ─────────────────────────────────
exports.generateRoadmap = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // try to get role requirements from DB
    let requiredSkills = [];
    const roleReq = await RoleRequirement.findOne({
      company: user.targetCompany,
      role: user.targetRole,
    });

    if (roleReq) {
      requiredSkills = roleReq.requiredSkills.map(s => s.toLowerCase());
    } else {
      // fallback to default skills based on role
      const defaultSkills = DEFAULT_REQUIRED_SKILLS[user.targetRole]
        || DEFAULT_REQUIRED_SKILLS["SWE"];
      requiredSkills = defaultSkills;

      console.log(`No role requirements found for ${user.targetCompany} ${user.targetRole}. Using defaults: ${defaultSkills}`);
    }

    const userSkills = user.skills.map(s => s.toLowerCase());
    const missingSkills = requiredSkills.filter(s => !userSkills.includes(s));

    // if user has all skills still generate full plan
    const skillsToLearn = missingSkills.length > 0 ? missingSkills : requiredSkills;

    const level = userSkills.length === 0 ? "beginner"
      : userSkills.length <= 2 ? "beginner" : "intermediate";

    // delete existing roadmap
    await Roadmap.deleteOne({ userId });

    const plan = generatePlan(skillsToLearn, level, user.background);

    const roadmap = await Roadmap.create({
      userId,
      targetRole: user.targetRole,
      targetCompany: user.targetCompany,
      level,
      background: user.background,
      totalDays: plan.length,
      plan,
    });

    res.status(201).json({
      message: "Roadmap generated successfully",
      level,
      totalDays: plan.length,
      targetRole: user.targetRole,
      targetCompany: user.targetCompany,
      missingSkills,
      plan: roadmap.plan,
    });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET ROADMAP ──────────────────────────────────────
exports.getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.userId });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found. Please generate one first." });
    res.status(200).json({ roadmap });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── COMPLETE DAY ─────────────────────────────────────
exports.completeDay = async (req, res) => {
  try {
    const userId = req.userId;
    const { day } = req.params;
    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    const dayPlan = roadmap.plan.find(p => p.day === parseInt(day));
    if (!dayPlan) return res.status(404).json({ message: "Day not found" });

    dayPlan.isCompleted = true;
    await roadmap.save();

    const completedDays = roadmap.plan.filter(p => p.isCompleted).length;
    const progressPercent = Math.round((completedDays / roadmap.totalDays) * 100);

    res.status(200).json({
      message: `Day ${day} marked as complete`,
      progressPercent, completedDays,
      totalDays: roadmap.totalDays,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
