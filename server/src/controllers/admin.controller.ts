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
    const { name, email, existingAvatar } = req.body;

    let avatar = existingAvatar;

    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.path,
        "avatars"
      );

      if (uploadRes) avatar = uploadRes.url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, avatar },
      { new: true }
    );

    res.json(user);
  } catch {
    res.status(500).json({ message: "Update failed" });
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
