import express from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getExperiences);

router.use(protect);

router.post("/", createExperience);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);

export default router;