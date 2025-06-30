// backend/controllers/userController.js

import User from "../models/user.js";

// @desc    Get all users filtered by role (e.g., Trainee or Instructor)
// @route   GET /api/users?role=Trainee or role=Instructor
export const getUsersByRole = async (req, res) => {
  const { role } = req.query;

  // Role must be specified in query
  if (!role) return res.status(400).json({ message: "Role is required" });

  try {
    // Fetch users matching the specified role
    const users = await User.find({ role });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users by role:", err.message);
    res.status(500).json({ message: "Error fetching users" });
  }
};
