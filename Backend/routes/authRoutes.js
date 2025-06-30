// Routes related to user authentication and password management

import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// Route to register a new user (Instructor or Trainee)
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route to initiate password reset (simulated)
router.post("/forgot-password", forgotPassword);

// Route to reset password after receiving token (simulated)
router.post("/reset-password", resetPassword);

export default router;
