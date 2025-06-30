// Routes related to training modules: create, assign, track progress, etc.

import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // Middleware to protect routes

import {
  createModule,
  getAllModules,
  assignModule,
  getTraineeProgress,
  deleteModule,
  unassignModule
} from "../controllers/moduleController.js";

const router = express.Router();

// Create a new training module (Instructor only)
router.post("/", protect, createModule);

// Get all training modules (Instructor/Trainee)
router.get("/", protect, getAllModules);

// Assign a module to a specific trainee
router.post("/assign", protect, assignModule);

// View progress of a specific trainee
router.get("/progress/:traineeId", protect, getTraineeProgress);

// Delete a module by ID (also removes from trainees)
router.delete("/:id", protect, deleteModule);

// Unassign a module from a specific trainee
router.post("/unassign", protect, unassignModule);

export default router;
