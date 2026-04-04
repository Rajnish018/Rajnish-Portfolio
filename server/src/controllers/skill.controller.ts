import { Request, Response } from "express";
import Skill from "../models/skill.model";
import mongoose from "mongoose";

/* ------------------ GET ------------------ */
export const getSkills = async (_req: Request, res: Response) => {
  try {
    let skills = await Skill.findOne();
    if (!skills) {
      // Default to empty array instead of empty object
      skills = await Skill.create({ categories: [] });
    }
    res.json(skills);
  } catch {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

/* ------------------ BULK UPDATE ------------------ */
export const updateSkills = async (req: Request, res: Response) => {
  try {
    let skills = await Skill.findOne();
    if (!skills) {
      skills = new Skill(req.body);
    } else {
      skills.categories = req.body.categories;
    }
    await skills.save();
    res.json(skills);
  } catch {
    res.status(500).json({ message: "Bulk update failed" });
  }
};

/* ------------------ ADD CATEGORY ------------------ */
export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon, color } = req.body;
    const skills = await Skill.findOne();

    if (!skills) return res.status(404).json({ message: "Not found" });

    // Check if name already exists in the array
    const exists = skills.categories.some(cat => cat.categoryName === name);
    if (exists) return res.status(400).json({ message: "Category already exists" });

    // Push new category object into array
    skills.categories.push({
      categoryName: name,
      items: [],
      config: {
        icon: icon || "layout",
        color: color || "emerald",
      },
    });

    await skills.save();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Add category failed" });
  }
};

/* ------------------ ADD SKILL (BY CATEGORY ID) ------------------ */
export const addSkillToCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params; // We now use ID from URL
    const { name, level } = req.body;

    const skills = await Skill.findOne();
    if (!skills) return res.status(404).json({ message: "Not found" });

    // Find category by ID in the array
    const category = skills.categories.id(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.items.push({ name, level });
    await skills.save();

    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Add skill failed" });
  }
};

/* ------------------ UPDATE SKILL ------------------ */
export const updateSkillInCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, skillId } = req.params;
    const updatedFields = req.body;

    const skills = await Skill.findOne();
    if (!skills) return res.status(404).json({ message: "Not found" });

    const category = skills.categories.id(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const skill = category.items.id(skillId);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Apply updates
    Object.assign(skill, updatedFields);

    await skills.save();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Update skill failed" });
  }
};

/* ------------------ DELETE SKILL ------------------ */
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { categoryId, skillId } = req.params;



    // Validation check: If categoryId is "remove-category", something is wrong with route order
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid Category ID format" });
    }

    const skills = await Skill.findOne();
    if (!skills) return res.status(404).json({ message: "Not found" });
    
    const category = skills.categories.id(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.items.pull({ _id: skillId });
    await skills.save();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Delete skill failed" });
  }
};

/* ------------------ DELETE CATEGORY (BY ID) ------------------ */

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    
    // console.log("===> DELETE ROUTE HIT");
    // console.log("===> Category ID from Params:", categoryId);

    // 1. Find the master document
    const skills = await Skill.findOne();
    
    if (!skills) {
      console.log("===> ERROR: No Skills document found in Database.");
      return res.status(404).json({ message: "Master Skill document missing" });
    }

    // console.log("===> Categories count before pull:", skills.categories.length);

    // 2. Perform the pull
    skills.categories.pull({ _id: categoryId });
    
    // 3. Save
    await skills.save();
    
    // console.log("===> Categories count after pull:", skills.categories.length);
    res.json(skills);
  } catch (err: any) {
    console.error("===> SERVER CRASH:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};