import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = express.Router();


router.get("/", getProjects);

router.use(protect)

router.get("/:id",getProjectById);
// accept either a single `image` field or multiple `images` field (for backwards compatibility)
router.post("/", upload.fields([{ name: 'images', maxCount: 6 }, { name: 'image', maxCount: 1 }]), createProject);
router.put("/:id", upload.fields([{ name: 'images', maxCount: 6 }, { name: 'image', maxCount: 1 }]), updateProject);
router.delete("/:id", deleteProject);

export default router;
