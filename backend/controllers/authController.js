const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── REGISTER ───────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      degree,
      background,
      skills,
      careerGoal,
      targetCompany,
      targetRole,
    } = req.body;

    // 1. check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      degree,
      background,
      skills,
      careerGoal,
      targetCompany,
      targetRole,
    });

    // 4. generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // 5. send response
    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        degree: user.degree,
        background: user.background,
        skills: user.skills,
        careerGoal: user.careerGoal,
        targetCompany: user.targetCompany,
        targetRole: user.targetRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── LOGIN ───────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // 2. compare entered password with hashed password in DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 3. generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // 4. send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        degree: user.degree,
        background: user.background,
        skills: user.skills,
        careerGoal: user.careerGoal,
        targetCompany: user.targetCompany,
        targetRole: user.targetRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET LOGGED IN USER PROFILE ──────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};