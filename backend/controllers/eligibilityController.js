const User = require("../models/User");
const RoleRequirement = require("../models/RoleRequirement");

exports.checkEligibility = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const roleReq = await RoleRequirement.findOne({
      company: user.targetCompany,
      role: user.targetRole,
    });
    if (!roleReq) {
      return res.status(404).json({
        message: "Role requirements not found for this company and role",
      });
    }
    const isDegreeEligible = roleReq.requiredDegrees.includes(user.degree);
    const isBackgroundEligible =
      roleReq.background === "any" || roleReq.background === user.background;
    const userSkills = user.skills.map((s) => s.toLowerCase());
    const requiredSkills = roleReq.requiredSkills.map((s) => s.toLowerCase());
    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.includes(skill)
    );
    const missingSkills = requiredSkills.filter(
      (skill) => !userSkills.includes(skill)
    );
    const skillMatchPercent = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );
    const isEligible =
      isDegreeEligible && isBackgroundEligible && missingSkills.length === 0;
    let alternativeRoles = [];
    if (!isEligible) {
      alternativeRoles = await RoleRequirement.find({
        requiredDegrees: user.degree,
        background: { $in: [user.background, "any"] },
      }).select("company role requiredSkills");
      alternativeRoles = alternativeRoles.filter(
        (r) =>
          !(r.company === user.targetCompany && r.role === user.targetRole)
      );
    }
    res.status(200).json({
      isEligible,
      user: {
        name: user.name,
        degree: user.degree,
        background: user.background,
        skills: user.skills,
        targetCompany: user.targetCompany,
        targetRole: user.targetRole,
      },
      eligibilityBreakdown: {
        isDegreeEligible,
        isBackgroundEligible,
        skillMatchPercent,
        matchedSkills,
        missingSkills,
      },
      alternativeRoles: isEligible ? [] : alternativeRoles,
      message: isEligible
        ? `You are eligible for ${user.targetRole} at ${user.targetCompany}`
        : `You are not eligible for ${user.targetRole} at ${user.targetCompany}. Missing skills: ${missingSkills.join(", ")}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
