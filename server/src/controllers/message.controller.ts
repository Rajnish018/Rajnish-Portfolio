import { Request, Response } from "express";
import Message from "../models/message.model";

// GET ALL MESSAGES
export const getMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// CREATE MESSAGE
export const createMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({  message: "Message sent successfully", data: message });
  } catch (error){
    res.status(500).json({ message: "Failed to send message" });
  }
};

// DELETE MESSAGE
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete message" });
  }
};
