// Core imports
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Model import for seeding instructor codes
import SecurityCode from "./models/SecurityCode.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors());         // Enable CORS for all origins

// Test route (root URL)
app.get("/", (req, res) => {
  res.send("API running ✅");
});

// API route handlers
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/users", userRoutes);

// Seed predefined instructor codes if DB is empty
const seedInstructorCodes = async () => {
  const count = await SecurityCode.countDocuments();
  if (count === 0) {
    await SecurityCode.insertMany([
      { code: "admin-01" },
      { code: "int-17" },
      { code: "Kaushal" },
    ]);
    console.log("✅ Instructor codes seeded");
  } else {
    console.log("✅ Instructor codes already exist");
  }
};

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await seedInstructorCodes(); // Seed codes before starting

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Exit process on failure
  }
};

startServer(); // Boot it up
