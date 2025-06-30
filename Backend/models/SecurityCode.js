// backend/models/SecurityCode.js

import mongoose from "mongoose";

// Schema to store valid instructor registration codes
const securityCodeSchema = new mongoose.Schema({
  // Each code must be unique and is required
  code: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create and export the SecurityCode model
export default mongoose.model("SecurityCode", securityCodeSchema);
