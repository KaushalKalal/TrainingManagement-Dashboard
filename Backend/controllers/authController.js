// backend/controllers/authController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.js";
import SecurityCode from "../models/SecurityCode.js";

const resetTokens = new Map(); // In-memory map for reset tokens (not production-safe)

// Helper: Generate a signed JWT for a user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register new user (Trainee or Instructor)
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, role, instructorCode } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Only allow instructor registration if they provide a valid security code
  if (role === "Instructor") {
    if (!instructorCode) {
      return res
        .status(400)
        .json({ message: "Instructor security code is required" });
    }

    const isValidCode = await SecurityCode.findOne({ code: instructorCode });
    if (!isValidCode) {
      return res.status(403).json({ message: "Invalid instructor code" });
    }
  }

  // Prevent duplicate registration
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = generateToken(user._id);

  // Send back basic user info with token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
};

// @desc    Request password reset (simulated via console)
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  resetTokens.set(email, token);

  // This simulates sending a reset link via email
  console.log(`Reset token for ${email}: ${token}`);

  res.json({ message: "Reset link sent (simulated). Check console." });
};

// @desc    Reset password using current password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters long" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect current password" });
  }

  const hashedNew = await bcrypt.hash(newPassword, 10);
  user.password = hashedNew;
  await user.save();

  res.json({ message: "Password reset successful" });
};
