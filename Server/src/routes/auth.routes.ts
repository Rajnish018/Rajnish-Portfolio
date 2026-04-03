import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);

export default router;