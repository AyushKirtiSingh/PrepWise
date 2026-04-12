const User = require("../models/User");
const RoleRequirement = require("../models/RoleRequirement");

exports.getSkillGap = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. get user profile
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
      return res.status(404).json({
        message: "Role requirements not found",
      });
    }

    // 3. compare skills
    const userSkills = user.skills.map((s) => s.toLowerCase());
    const requiredSkills = roleReq.requiredSkills.map((s) => s.toLowerCase());

    const strongSkills = requiredSkills.filter((skill) =>
      userSkills.includes(skill)
    );
    const missingSkills = requiredSkills.filter(
      (skill) => !userSkills.includes(skill)
    );
    const extraSkills = userSkills.filter(
      (skill) => !requiredSkills.includes(skill)
    );

    // 4. assign priority to missing skills
    // first missing skill = highest priority
    const missingWithPriority = missingSkills.map((skill, index) => ({
      skill,
      priority: index === 0 ? "high" : index === 1 ? "medium" : "low",
      reason: `Required for ${user.targetRole} at ${user.targetCompany}`,
    }));

    // 5. calculate readiness score
    const readinessScore = Math.round(
      (strongSkills.length / requiredSkills.length) * 100
    );

    // 6. generate recommendation message
    let recommendation = "";
    if (readinessScore === 100) {
      recommendation = "You have all required skills. Focus on mock tests and system design practice.";
    } else if (readinessScore >= 60) {
      recommendation = `You are ${readinessScore}% ready. Focus on: ${missingSkills.slice(0, 2).join(", ")}`;
    } else {
      recommendation = `You need significant preparation. Start with: ${missingSkills[0]}`;
    }

    res.status(200).json({
      targetRole: user.targetRole,
      targetCompany: user.targetCompany,
      readinessScore,
      recommendation,
      skillAnalysis: {
        strongSkills,
        missingSkills: missingWithPriority,
        extraSkills,
        totalRequired: requiredSkills.length,
        totalMatched: strongSkills.length,
        totalMissing: missingSkills.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
