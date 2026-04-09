import { Request, Response } from "express";
import Team from "../models/team.model";
import { uploadToCloudinary } from "../utils/cloudinaryHandler";

// ---------------- GET ALL ----------------
export const getTeam = async (_req: Request, res: Response) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch team" });
  }
};

// ---------------- CREATE ----------------
export const createMember = async (req: any, res: Response) => {
  try {
    const { name, role, bio } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role are required",
      });
    }

    let image = "";

    // 🔥 HANDLE IMAGE
    if (req.file?.path) {
      const uploadRes = await uploadToCloudinary(
        req.file.path,
        "team"
      );

      if (uploadRes?.url) {
        image = uploadRes.url;
      }
    }

    const member = await Team.create({
      name: name.trim(),
      role: role.trim(),
      bio: bio || "",
      image,
    });

    res.status(201).json(member);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create member" });
  }
};

// ---------------- UPDATE ----------------
export const updateMember = async (req: any, res: Response) => {
  try {
    const { name, role, bio, existingImage } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role are required",
      });
    }

    let image = existingImage;

    // 🔥 HANDLE NEW IMAGE
    if (req.file?.path) {
      const uploadRes = await uploadToCloudinary(
        req.file.path,
        "team"
      );

      if (uploadRes?.url) {
        image = uploadRes.url;
      }
    }

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        role: role.trim(),
        bio: bio || "",
        image,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// ---------------- DELETE ----------------
export const deleteMember = async (req: Request, res: Response) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};