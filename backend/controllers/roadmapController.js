const User = require("../models/User");
const RoleRequirement = require("../models/RoleRequirement");
const Roadmap = require("../models/Roadmap");

// helper function — generates day wise plan based on missing skills and level
const generatePlan = (missingSkills, level, background) => {
  const plan = [];
  let day = 1;

  // topic wise content based on level
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
        { topic: "Advanced Arrays", tasks: ["kadanes algorithm", "trapping rain water", "merge intervals"] },
        { topic: "Advanced Trees", tasks: ["lowest common ancestor", "serialize tree", "balanced BST"] },
        { topic: "Graphs Advanced", tasks: ["dijkstra", "topological sort", "minimum spanning tree"] },
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
        { topic: "Design URL Shortener", tasks: ["requirements", "data model", "scaling"] },
        { topic: "Design Twitter Feed", tasks: ["fanout model", "caching strategy", "database choice"] },
        { topic: "Design WhatsApp", tasks: ["message queue", "websockets", "storage"] },
      ],
    },
    os: {
      beginner: [
        { topic: "OS Basics", tasks: ["process vs thread", "memory management", "scheduling algorithms"] },
        { topic: "Deadlocks", tasks: ["conditions", "prevention", "banker algorithm"] },
        { topic: "Memory", tasks: ["paging", "segmentation", "virtual memory"] },
      ],
      intermediate: [
        { topic: "Advanced Scheduling", tasks: ["round robin", "priority scheduling", "multilevel queue"] },
        { topic: "File Systems", tasks: ["inode", "file allocation", "directory structure"] },
      ],
    },
    dbms: {
      beginner: [
        { topic: "DBMS Basics", tasks: ["ER diagrams", "normalization", "keys and constraints"] },
        { topic: "SQL Queries", tasks: ["select join", "group by", "subqueries"] },
        { topic: "Transactions", tasks: ["ACID properties", "isolation levels", "deadlock in DB"] },
      ],
      intermediate: [
        { topic: "Indexing", tasks: ["B+ tree index", "clustered vs non clustered", "query optimization"] },
        { topic: "Advanced SQL", tasks: ["window functions", "stored procedures", "triggers"] },
      ],
    },
    sql: {
      beginner: [
        { topic: "SQL Basics", tasks: ["select", "where", "order by", "group by"] },
        { topic: "Joins", tasks: ["inner join", "left join", "right join", "full join"] },
        { topic: "Aggregations", tasks: ["count", "sum", "avg", "having clause"] },
      ],
    },
    python: {
      beginner: [
        { topic: "Python Basics", tasks: ["variables", "loops", "functions", "lists"] },
        { topic: "OOP in Python", tasks: ["classes", "inheritance", "polymorphism"] },
        { topic: "Python Libraries", tasks: ["pandas basics", "numpy basics", "matplotlib"] },
      ],
    },
    excel: {
      beginner: [
        { topic: "Excel Basics", tasks: ["formulas", "vlookup", "pivot tables"] },
        { topic: "Data Analysis", tasks: ["charts", "conditional formatting", "data validation"] },
      ],
    },
    statistics: {
      beginner: [
        { topic: "Statistics Basics", tasks: ["mean median mode", "standard deviation", "probability"] },
        { topic: "Distributions", tasks: ["normal distribution", "binomial", "hypothesis testing"] },
      ],
    },
  };

  // if non technical background — add programming basics first
  if (background === "non-technical") {
    plan.push({
      day: day++,
      topic: "Programming Basics",
      tasks: ["what is programming", "variables and data types", "control flow"],
      isCompleted: false,
    });
    plan.push({
      day: day++,
      topic: "Python Introduction",
      tasks: ["install python", "first program", "basic syntax"],
      isCompleted: false,
    });
  }

  // add days for each missing skill
  missingSkills.forEach((skill) => {
    const skillKey = skill.toLowerCase();
    const levelKey = level === "advanced" ? "intermediate" : level;
    const content = topicContent[skillKey]?.[levelKey] ||
      topicContent[skillKey]?.["beginner"] || [];

    content.forEach((item) => {
      plan.push({
        day: day++,
        topic: item.topic,
        tasks: item.tasks,
        isCompleted: false,
      });
    });

    // add practice day after each skill
    plan.push({
      day: day++,
      topic: `${skill.toUpperCase()} Practice & Revision`,
      tasks: ["solve 5 problems", "revise notes", "take mini quiz"],
      isCompleted: false,
    });
  });

  // add final preparation days
  plan.push({
    day: day++,
    topic: "Mock Interview Preparation",
    tasks: ["review all topics", "practice explaining solutions", "time yourself"],
    isCompleted: false,
  });
  plan.push({
    day: day++,
    topic: "Final Revision",
    tasks: ["revise weak areas", "solve mixed problems", "mental preparation"],
    isCompleted: false,
  });

  return plan;
};

// ─── GENERATE ROADMAP ─────────────────────────────────
exports.generateRoadmap = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. get role requirements
    const roleReq = await RoleRequirement.findOne({
      company: user.targetCompany,
      role: user.targetRole,
    });
    if (!roleReq) {
      return res.status(404).json({ message: "Role requirements not found" });
    }

    // 3. find missing skills
    const userSkills = user.skills.map((s) => s.toLowerCase());
    const requiredSkills = roleReq.requiredSkills.map((s) => s.toLowerCase());
    const missingSkills = requiredSkills.filter(
      (skill) => !userSkills.includes(skill)
    );

    // 4. detect user level from skills
    const level = userSkills.length === 0 ? "beginner" :
      userSkills.length <= 2 ? "beginner" : "intermediate";

    // 5. check if roadmap already exists — if yes delete and regenerate
    await Roadmap.deleteOne({ userId });

    // 6. generate plan
    const plan = generatePlan(missingSkills, level, user.background);

    // 7. save roadmap to database
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET EXISTING ROADMAP ─────────────────────────────
exports.getRoadmap = async (req, res) => {
  try {
    const userId = req.userId;
    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({
        message: "No roadmap found. Please generate one first.",
      });
    }
    res.status(200).json({ roadmap });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── MARK DAY AS COMPLETE ─────────────────────────────
exports.completeDay = async (req, res) => {
  try {
    const userId = req.userId;
    const { day } = req.params;

    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // find the day and mark it complete
    const dayPlan = roadmap.plan.find((p) => p.day === parseInt(day));
    if (!dayPlan) {
      return res.status(404).json({ message: "Day not found in roadmap" });
    }

    dayPlan.isCompleted = true;
    await roadmap.save();

    // calculate progress
    const completedDays = roadmap.plan.filter((p) => p.isCompleted).length;
    const progressPercent = Math.round(
      (completedDays / roadmap.totalDays) * 100
    );

    res.status(200).json({
      message: `Day ${day} marked as complete`,
      progressPercent,
      completedDays,
      totalDays: roadmap.totalDays,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
