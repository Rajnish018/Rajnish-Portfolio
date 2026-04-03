import express from "express";
import { createMessage, deleteMessage, getMessages } from "../controllers/message.controller";

const router = express.Router();

router.get("/", getMessages);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);

export default router;