import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    role: String,
    image: String,
    bio: String,
  },
  { timestamps: true }
);

export default mongoose.models.Team ||
  mongoose.model<ITeam>("Team", teamSchema);