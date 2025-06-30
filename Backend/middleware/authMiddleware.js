// backend/middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer'
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // Extract token from the header
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
      }

      // Verify and decode the token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

      // Fetch the user from DB without the password field
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Allow request to proceed
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
