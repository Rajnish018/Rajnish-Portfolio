import mongoose, { Schema, Document } from "mongoose";

/* ------------------ Types ------------------ */

export interface ISkill {
  _id?: string;
  name: string;
  level: number;
}

export interface ICategory {
  _id?: string; // Mongoose will generate this automatically
  categoryName: string; // Moved from 'key' to a property
  items: ISkill[];
  config: {
    icon: string;
    color: string;
  };
}

export interface ISkillSet extends Document {
  categories: ICategory[]; // Changed from Map to Array
}

/* ------------------ Skill Schema ------------------ */

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
  }
);

/* ------------------ Category Schema ------------------ */

const categorySchema = new Schema<ICategory>(
  {
    categoryName: { type: String, required: true }, // Store the name here
    items: {
      type: [skillSchema],
      default: [],
    },
    config: {
      icon: { type: String, default: "layout" },
      color: { type: String, default: "emerald" },
    },
  },
  { _id: true } // Ensure _id is enabled for categories
);

/* ------------------ Main SkillSet Schema ------------------ */

const skillSetSchema = new Schema<ISkillSet>(
  {
    // Changed from Map to an Array of categorySchema
    categories: [categorySchema], 
  },
  { timestamps: true }
);

/* ------------------ Model ------------------ */

export default mongoose.model<ISkillSet>("SkillSet", skillSetSchema);
