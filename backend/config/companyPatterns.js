const companyPatterns = {
  Google: {
    duration: 90 * 60, // 90 minutes in seconds
    totalQuestions: 15,
    description: "Google focuses heavily on algorithmic thinking, data structures, and system design. Questions are open-ended and test depth of understanding.",
    pattern: [
      { topic: "DSA", type: "coding", count: 6, difficulty: "hard" },
      { topic: "DSA", type: "MCQ", count: 4, difficulty: "hard" },
      { topic: "System Design", type: "MCQ", count: 3, difficulty: "hard" },
      { topic: "OS", type: "MCQ", count: 2, difficulty: "hard" },
    ],
    tips: [
      "Always explain your thought process out loud",
      "Start with brute force then optimize",
      "Discuss time and space complexity for every solution",
      "Google values clean code and edge case handling",
    ],
  },
  Amazon: {
    duration: 105 * 60, // 105 minutes
    totalQuestions: 20,
    description: "Amazon tests DSA heavily in OA rounds. Also tests Leadership Principles. Focus on optimization and real-world problem solving.",
    pattern: [
      { topic: "DSA", type: "coding", count: 8, difficulty: "hard" },
      { topic: "DSA", type: "MCQ", count: 4, difficulty: "medium" },
      { topic: "DBMS", type: "MCQ", count: 4, difficulty: "medium" },
      { topic: "System Design", type: "MCQ", count: 4, difficulty: "hard" },
    ],
    tips: [
      "Amazon OA has 2 coding questions in 105 minutes",
      "Focus on array, string, tree, and graph problems",
      "Always consider edge cases: empty array, single element, negative numbers",
      "Amazon values working solution first, then optimization",
    ],
  },
  Microsoft: {
    duration: 90 * 60, // 90 minutes
    totalQuestions: 18,
    description: "Microsoft focuses on problem solving, OOP design, and system design. Tests both coding and conceptual understanding.",
    pattern: [
      { topic: "DSA", type: "coding", count: 6, difficulty: "hard" },
      { topic: "DSA", type: "MCQ", count: 4, difficulty: "medium" },
      { topic: "OS", type: "MCQ", count: 4, difficulty: "hard" },
      { topic: "DBMS", type: "MCQ", count: 4, difficulty: "medium" },
    ],
    tips: [
      "Microsoft values communication and clarity",
      "Be prepared to discuss trade-offs in your solution",
      "OOP design questions are common",
      "Focus on trees, graphs, and dynamic programming",
    ],
  },
};

module.exports = companyPatterns;
