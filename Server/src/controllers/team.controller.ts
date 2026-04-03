import { Request, Response } from "express";
import Team from "../models/team.model";

// GET ALL
export const getTeam = async (_req: Request, res: Response) => {
  try {
    const members = await Team.find();
    res.json(members);
  } catch {
    res.status(500).json({ message: "Failed to fetch team" });
  }
};

// CREATE
export const createMember = async (req: Request, res: Response) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json(member);
  } catch {
    res.status(500).json({ message: "Failed to create member" });
  }
};

// UPDATE
export const updateMember = async (req: Request, res: Response) => {
  try {
    const member = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );
    res.json(member);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE
export const deleteMember = async (req: Request, res: Response) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};