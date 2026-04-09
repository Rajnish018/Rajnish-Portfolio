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
import { protect } from "../middleware/auth.middleware";

const router = express.Router();


router.get("/", getSkills);

router.use(protect)

router.put("/", updateSkills);

router.put("/category", addCategory);

router.post("/:categoryId", addSkillToCategory);

router.patch("/:categoryId/:skillId", updateSkillInCategory);

router.delete("/remove-category/:categoryId", deleteCategory);

router.delete("/:categoryId/:skillId", deleteSkill);


export default router;