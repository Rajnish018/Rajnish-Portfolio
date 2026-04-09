import express from "express";
import { getStats } from "../controllers/stats.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();


router.use(protect);

router.get("/", getStats);

export default router;