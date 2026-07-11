import mongoose, { Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  image: string | string[];
  tags: string[];
  status: string;
  githubLink:string;
  previewLink:string;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    // allow either a single image URL or an array of image URLs
    image: { type: [String], default: [] },
    tags: [{ type: String }],
    status: { type: String },
    githubLink:{type:String},
    previewLink:{type:String}
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", projectSchema);