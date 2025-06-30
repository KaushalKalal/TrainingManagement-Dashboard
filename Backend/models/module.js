// backend/models/module.js

import mongoose from "mongoose";

// Schema to represent a training module
const moduleSchema = new mongoose.Schema(
  {
    // Title of the module (required)
    title: {
      type: String,
      required: true,
    },

    // Optional description about the module
    description: String,

    // Array of trainees (User IDs) to whom this module is assigned
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Array of trainees (User IDs) who have completed this module
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // The instructor (User ID) who created this module
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // Automatically includes createdAt and updatedAt fields
);

// Create and export the Module model
const Module = mongoose.model("Module", moduleSchema);
export default Module;
