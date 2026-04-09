import express from "express";
import {
  getTeam,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/team.controller";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = express.Router();


router.use(protect)

router.get("/", getTeam);
router.post("/",upload.single("image"), createMember);
router.put("/:id", upload.single("image"),updateMember);
router.delete("/:id", deleteMember);

export default router;