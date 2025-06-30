// backend/controllers/moduleController.js

import Module from "../models/module.js";
import User from "../models/user.js";

// @desc    Create a new training module
// @route   POST /api/modules
export const createModule = async (req, res) => {
  const { title, description } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });

  const module = await Module.create({
    title,
    description,
    createdBy: req.user._id,
  });

  res.status(201).json(module);
};

// @desc    Get all modules with assigned and completed info
// @route   GET /api/modules
export const getAllModules = async (req, res) => {
  const modules = await Module.find()
    .populate("assignedTo", "name email")
    .populate("completedBy", "name email");

  res.json(modules);
};

// @desc    Assign a module to a trainee
// @route   POST /api/modules/assign
export const assignModule = async (req, res) => {
  const { moduleId, traineeId } = req.body;

  const module = await Module.findById(moduleId);
  if (!module) return res.status(404).json({ message: "Module not found" });

  if (!module.assignedTo.includes(traineeId)) {
    module.assignedTo.push(traineeId);
    await module.save();
  }

  res.json({ message: "Module assigned successfully" });
};

// @desc    Get progress of a specific trainee
// @route   GET /api/modules/progress/:traineeId
export const getTraineeProgress = async (req, res) => {
  const { traineeId } = req.params;

  const modules = await Module.find({ assignedTo: traineeId });

  const completedCount = modules.filter((mod) =>
    mod.completedBy.includes(traineeId)
  ).length;

  res.json({
    total: modules.length,
    completed: completedCount,
    pending: modules.length - completedCount,
    modules,
  });
};

// @desc    Mark a module as completed by the trainee
// @route   POST /api/modules/complete
export const markModuleCompleted = async (req, res) => {
  const { moduleId } = req.body;
  const userId = req.user._id;

  const module = await Module.findById(moduleId);
  if (!module) return res.status(404).json({ message: "Module not found" });

  const assigned = module.assignedTo.map(id => id.toString());
  const completed = module.completedBy.map(id => id.toString());

  if (assigned.includes(userId.toString()) && !completed.includes(userId.toString())) {
    module.completedBy.push(userId);
    await module.save();
  }

  res.json({ message: "Module marked as completed" });
};

// @desc    Delete a module and remove it from all trainees
// @route   DELETE /api/modules/:id
export const deleteModule = async (req, res) => {
  const { id } = req.params;

  const module = await Module.findById(id);
  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  await Module.findByIdAndDelete(id);

  res.json({ message: "Module deleted successfully" });
};

// @desc    Unassign a module from a specific trainee
// @route   POST /api/modules/unassign
export const unassignModule = async (req, res) => {
  const { moduleId, traineeId } = req.body;

  try {
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    module.assignedTo = module.assignedTo.filter(
      (id) => id.toString() !== traineeId
    );

    module.completedBy = module.completedBy.filter(
      (id) => id.toString() !== traineeId
    );

    await module.save();
    res.json({ message: "Unassigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
