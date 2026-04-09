import { Request, Response } from "express";
import fs from "fs";
import { uploadToCloudinary } from "../utils/cloudinaryHandler"; 

export const uploadImage = async (req: any, res: Response) => {
  try {
    const file = req.file;
    const type = req.query.type as string;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    if (!type) {
      return res.status(400).json({
        message: "Upload type is required (avatar | project)",
      });
    }


    let folder: string;

    switch (type) {
      case "avatar":
        folder = "admin-avatars";
        break;

      case "project":
        folder = "admin-projects";
        break;

      default:
        return res.status(400).json({
          message: "Invalid upload type",
        });
    }

    const localPath = file.path;

    const result = await uploadToCloudinary(localPath, folder);

   
   
    if (!result || !result.url) {
      return res.status(500).json({
        message: "Cloudinary upload failed",
      });
    }

    return res.status(200).json({
      success: true,
      url: result.url,
      type,
    });

  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      message: "Server error during upload",
    });
  }
};