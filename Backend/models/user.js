// backend/models/User.js

import mongoose from "mongoose";

// This schema defines a user in the system, either a Trainee or an Instructor
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: true,
    },

    // Unique email for login and identification
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Hashed password with a minimum length validation
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },

    // User role - either a Trainee or an Instructor
    role: {
      type: String,
      enum: ["Trainee", "Instructor"],
      default: "Trainee",
    },

    // List of modules assigned to the user (used for trainees)
    assignedModules: [
      {
        moduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Module",
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the User model
export default mongoose.model("User", userSchema);
