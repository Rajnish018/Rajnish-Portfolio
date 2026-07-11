import { Request, Response } from "express";
import Project from "../models/project.model";
import { uploadToCloudinary } from "../utils/cloudinaryHandler";

// ---------------- NORMALIZER ----------------
const normalizeProjectPayload = (body: Record<string, any>) => {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const category =
    typeof body.category === "string" ? body.category.trim() : "";
  // image can be a string URL, a JSON stringified array, or an array
  let image: string | string[] = [];
  if (typeof body.image === "string") {
    try {
      const parsed = JSON.parse(body.image);
      if (Array.isArray(parsed)) image = parsed;
      else image = body.image.trim();
    } catch {
      image = body.image.trim();
    }
  } else if (Array.isArray(body.image)) {
    image = body.image.map((i) => (typeof i === "string" ? i.trim() : i));
  }
  const status =
    typeof body.status === "string" ? body.status.trim() : "DRAFT";
  const githubLink =
    typeof body.githubLink === "string" ? body.githubLink.trim() : "";
  const previewLink =
    typeof body.previewLink === "string" ? body.previewLink.trim() : "";

  // 🔥 FIX: handle JSON string tags
  let tags: string[] = [];
  if (typeof body.tags === "string") {
    try {
      tags = JSON.parse(body.tags);
    } catch {
      tags = [];
    }
  } else if (Array.isArray(body.tags)) {
    tags = body.tags
      .filter((tag) => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

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

// ---------------- CREATE ----------------
export const createProject = async (req: Request, res: Response) => {
  try {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title || !payload.description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // 🔥 IMAGE UPLOAD (support multiple files via req.files or fields)
    const filesObj: any = (req as any).files || {};
    let files: Express.Multer.File[] = [];
    if (Array.isArray(filesObj)) {
      // multer may populate req.files as array in some setups
      files = filesObj as any;
    } else {
      // fields-style: { images: [...], image: [...] }
      files = [].concat(filesObj.images || filesObj.image || []);
    }

    if (files.length > 0) {
      const urls: string[] = [];
      for (const f of files) {
        try {
          const uploadRes = await uploadToCloudinary(f.path, "projects");
          if (uploadRes && uploadRes.url) urls.push(uploadRes.url);
        } catch (e) {
          console.error("Upload failed for file:", f.path, e);
        }
      }

      // merge with any existing image(s) value in payload
      if (payload.image && payload.image.length) {
        const existing = Array.isArray(payload.image) ? payload.image : [payload.image as string];
        payload.image = [...existing, ...urls];
      } else {
        payload.image = urls;
      }
    }

    const project = await Project.create(payload);

    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// ---------------- GET ALL ----------------
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// ---------------- GET ONE ----------------
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching project" });
  }
};

// ---------------- UPDATE ----------------
export const updateProject = async (req: Request, res: Response) => {
  try {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title || !payload.description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // 🔥 IMAGE LOGIC (support multiple files)
    const filesObj: any = (req as any).files || {};
    let files: Express.Multer.File[] = [];
    if (Array.isArray(filesObj)) {
      files = filesObj as any;
    } else {
      files = [].concat(filesObj.images || filesObj.image || []);
    }

    if (files.length > 0) {
      const urls: string[] = [];
      for (const f of files) {
        try {
          const uploadRes = await uploadToCloudinary(f.path, "projects");
          if (uploadRes && uploadRes.url) urls.push(uploadRes.url);
        } catch (e) {
          console.error("Upload failed for file:", f.path, e);
        }
      }

      // If existing images provided in body, merge them
      let existing: string[] = [];
      if (req.body.existingImage) {
        try {
          const parsed = typeof req.body.existingImage === 'string' ? JSON.parse(req.body.existingImage) : req.body.existingImage;
          if (Array.isArray(parsed)) existing = parsed;
          else if (typeof parsed === 'string') existing = [parsed];
        } catch {
          if (typeof req.body.existingImage === 'string') existing = [req.body.existingImage];
        }
      }

      payload.image = [...existing, ...urls];
    } else if (req.body.existingImage) {
      // if no new files, use the existingImage value as-is
      try {
        const parsed = typeof req.body.existingImage === 'string' ? JSON.parse(req.body.existingImage) : req.body.existingImage;
        payload.image = parsed;
      } catch {
        payload.image = req.body.existingImage;
      }
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// ---------------- DELETE ----------------
export const deleteProject = async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};