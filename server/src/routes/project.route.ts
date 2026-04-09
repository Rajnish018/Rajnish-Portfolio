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
router.post("/",upload.single("image"), createProject);
router.put("/:id",upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;
