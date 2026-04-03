import express from "express";
import {
  getSkills,
  updateSkills,
  addSkillToCategory,
  updateSkillInCategory,
  deleteSkill,
  deleteCategory,
  addCategory,
} from "../controllers/skill.controller";

const router = express.Router();

// Get all skills
router.get("/", getSkills);

// Bulk update entire skills document
router.put("/", updateSkills);

// Create a new category
router.put("/category", addCategory);

// Use :categoryId (the MongoDB _id) instead of :category (the name)
// This makes routes more robust against special characters and typos
router.post("/:categoryId", addSkillToCategory);

router.patch("/:categoryId/:skillId", updateSkillInCategory);


// Delete category by its unique ID
router.delete("/remove-category/:categoryId", deleteCategory);


router.delete("/:categoryId/:skillId", deleteSkill);


export default router;