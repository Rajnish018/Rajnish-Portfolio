import express from "express";
import { createMessage, deleteMessage, getMessages } from "../controllers/message.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", createMessage);
router.get("/",getMessages)

router.use(protect)

router.delete("/:id", deleteMessage);

export default router;