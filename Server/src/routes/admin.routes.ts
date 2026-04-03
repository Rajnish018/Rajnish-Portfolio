import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  UploadAvatar
} from "../controllers/admin.controller";

import { protect } from "../middleware/auth.middleware";
import { upload } from "@/middleware/multer.middleware";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/upload-avatar", protect,upload.single("avatar"), UploadAvatar); // New route for avatar upload

export default router;