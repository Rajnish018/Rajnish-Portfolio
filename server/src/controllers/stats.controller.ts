import { Request, Response } from "express";
import Project from "../models/project.model";
import Message from "../models/message.model";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const totalProjects = await Project.countDocuments();
    const messageCount = await Message.countDocuments();

    // dummy for now (you can improve later)
    const totalViews = 1200;

    res.json({
      totalProjects,
      messageCount,
      totalViews,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};