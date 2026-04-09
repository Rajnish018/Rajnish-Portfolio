import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/admin.controller";

import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile",protect,upload.single("avatar"),updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
