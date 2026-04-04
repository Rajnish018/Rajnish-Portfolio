import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  UploadProject,
} from "../controllers/project.controller";
import { upload } from "../middleware/multer.middleware";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id",protect, getProjectById);
router.post("/",protect, createProject);
router.put("/:id", protect,updateProject);
router.delete("/:id",protect, deleteProject);
router.post("/upload",protect,upload.single("image"),UploadProject)

export default router;
