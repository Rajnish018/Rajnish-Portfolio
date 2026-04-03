import { Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../utils/cloudinaryHandler";

// ---------------- GET PROFILE ----------------
export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE PROFILE ----------------
export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    if(!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, avatar } = req.body;

    if(!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    } 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- CHANGE PASSWORD ----------------
export const changePassword = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const UploadAvatar = async (req: any, res: Response) => {
  try {
    const localPath = req.file?.path;

    if (!localPath) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const result = await uploadToCloudinary(localPath, "admin-avatars");

    if (!result || !result.url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    res.json({ url: result.url });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};
