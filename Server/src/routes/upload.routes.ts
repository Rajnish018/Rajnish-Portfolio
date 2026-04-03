import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file!.path);
    res.json({ url: result.secure_url });
  } catch {
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;