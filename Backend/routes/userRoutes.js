// Routes related to users (fetching by role, marking modules as complete)

import express from "express";
import { getUsersByRole } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { markModuleCompleted } from "../controllers/moduleController.js";

const router = express.Router();

// Get all users by role (e.g., /api/users?role=Trainee or Instructor)
router.get("/", protect, getUsersByRole);

// Mark a module as completed by a trainee
router.post("/complete", protect, markModuleCompleted);

export default router;
