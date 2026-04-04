import { Request, Response } from "express";
import Project from "../models/project.model";
import { uploadToCloudinary } from "../utils/cloudinaryHandler";

const normalizeProjectPayload = (body: Record<string, any>) => {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const status = typeof body.status === "string" ? body.status.trim() : "DRAFT";
  const githubLink =
    typeof body.githubLink === "string" ? body.githubLink.trim() : "";
  const previewLink =
    typeof body.previewLink === "string" ? body.previewLink.trim() : "";
  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((tag) => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return {
    title,
    description,
    category,
    image,
    status,
    githubLink,
    previewLink,
    tags,
  };
};

// CREATE
export const createProject = async (req: Request, res: Response) => {
  try {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title || !payload.description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const project = await Project.create(payload);
    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};


// GET ALL
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// GET ONE
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    res.json(project);
  } catch {
    res.status(500).json({ message: "Error fetching project" });
  }
};

// UPDATE
export const updateProject = async (req: Request, res: Response) => {
  try {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title || !payload.description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(project);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE
export const deleteProject = async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const UploadProject = async (req: any, res: Response) => {
  try {
    const localPath = req.file?.path;

    if (!localPath) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const result = await uploadToCloudinary(localPath, "admin-projects");

    if (!result || !result.url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    res.json({ url: result.url });
  } catch (error) {
    console.error("Project upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};
