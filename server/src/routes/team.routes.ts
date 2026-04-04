import express from "express";
import {
  getTeam,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/team.controller";

const router = express.Router();

router.get("/", getTeam);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;