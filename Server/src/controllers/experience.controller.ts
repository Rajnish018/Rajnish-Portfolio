import { Request, Response } from "express";
import Experience from "../models/experience.model";

// GET ALL
export const getExperiences = async (req: Request, res: Response) => {
  const data = await Experience.find().sort({ createdAt: -1 });
  res.json(data);
};

// CREATE
export const createExperience = async (req: Request, res: Response) => {
  const exp = await Experience.create(req.body);
  res.json(exp);
};

// UPDATE
export const updateExperience = async (req: Request, res: Response) => {
  const exp = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(exp);
};

// DELETE
export const deleteExperience = async (req: Request, res: Response) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};