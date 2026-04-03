import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  period: String,
  description: String,
}, { timestamps: true });

export default mongoose.model("Experience", experienceSchema);