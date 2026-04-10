import { Request, Response } from "express";
import Identity from "../models/link.model";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryHandler";

// ---------------- TYPES ----------------

interface Link {
  _id?: string;
  label: string;
  url: string;
}

interface UpdateIdentityBody {
  links?: string; // stringified JSON from FormData
}

// ---------------- GET CONTROLLER ----------------

export const getIdentity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const identity = await Identity.findOne().lean();

    if (!identity) {
      res.status(200).json({
        message: "No identity found, returning default",
        data: {
          links: [],
          profilePhoto: null,
        },
      });
      return;
    }

    res.status(200).json({
      message: "Identity fetched successfully",
      data: identity,
    });
  } catch (error: unknown) {
    console.error("Get Identity Error:", error);

    res.status(500).json({
      message: "Failed to fetch identity",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ---------------- UPDATE CONTROLLER ----------------

export const updateIdentity = async (
  req: Request<{}, {}, UpdateIdentityBody>,
  res: Response
): Promise<void> => {
  try {
    const { links } = req.body;

    let updateData: {
      links?: Link[];
      profilePhoto?: {
        url: string;
        public_id: string;
      };
    } = {};

    // -------- LINKS --------
    if (links) {
      try {
        updateData.links = JSON.parse(links);
      } catch {
        res.status(400).json({ message: "Invalid links format" });
        return;
      }
    }

    // -------- IMAGE --------
    if (req.file?.path) {
      const existing = await Identity.findOne();

      // Delete old image
      if (existing?.profilePhoto?.public_id) {
        await deleteFromCloudinary(existing.profilePhoto.public_id);
      }

      // Upload new image
      const uploaded = await uploadToCloudinary(
        req.file.path,
        "identity"
      );

      if (uploaded) {
        updateData.profilePhoto = {
          url: uploaded.url,
          public_id: uploaded.public_id,
        };
      }
    }

    // -------- DB UPDATE --------
    const updatedIdentity = await Identity.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Identity updated successfully",
      data: updatedIdentity,
    });
  } catch (error: unknown) {
    console.error("Update Identity Error:", error);

    res.status(500).json({
      message: "Failed to update identity",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ---------------- DELETE LINK ----------------

export const deleteLink = async (
  req: Request<{ linkId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { linkId } = req.params;

    const updatedIdentity = await Identity.findOneAndUpdate(
      {},
      {
        $pull: { links: { _id: linkId } },
      },
      { new: true }
    );

    if (!updatedIdentity) {
      res.status(404).json({ message: "Identity not found" });
      return;
    }

    res.status(200).json({
      message: "Link removed successfully",
      links: updatedIdentity.links,
    });
  } catch (error: unknown) {
    console.error("Delete Link Error:", error);

    res.status(500).json({
      message: "Error deleting link",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};