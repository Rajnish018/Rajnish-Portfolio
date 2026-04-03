import { Request, Response } from "express";
import Project from "../models/project.model";
import Message from "../models/message.model";

export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    // -----------------------------
    // TOTAL COUNTS
    // -----------------------------
    const [totalProjects, totalMessages] = await Promise.all([
      Project.countDocuments(),
      Message.countDocuments(),
    ]);

    // -----------------------------
    // PROJECT CATEGORY BREAKDOWN
    // -----------------------------
    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // -----------------------------
    // MONTHLY MESSAGE TREND (LAST 12 MONTHS)
    // -----------------------------
    const monthlyMessagesRaw = await Message.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // -----------------------------
    // FORMAT MONTH DATA
    // -----------------------------
    const monthlyMessages = monthlyMessagesRaw.map((item) => ({
      _id: item._id.month, // frontend expects month number
      year: item._id.year,
      count: item.count,
    }));

    // -----------------------------
    // RESPONSE
    // -----------------------------
    res.json({
      totalProjects,
      totalMessages,
      categoryStats,
      monthlyMessages,
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};