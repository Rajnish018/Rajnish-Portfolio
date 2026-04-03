import cloudinary from "../config/cloudinary";
import fs from "fs";

/**
 * Uploads a local file to Cloudinary and removes it from the local server
 * @param localFilePath Path to the file stored temporarily by Multer
 * @param folder Cloudinary folder name (e.g., 'projects', 'avatars')
 */
export const uploadToCloudinary = async (localFilePath: string, folder: string) => {
  try {
    if (!localFilePath) return null;

    // Upload the file
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `rr-labs/${folder}`,
      resource_type: "auto", // Automatically detect image/video/pdf
      transformation: [
        { width: 1200, crop: "limit" }, // Optimization: Resize large images
        { quality: "auto" },            // Auto-compression
        { fetch_format: "auto" }        // Auto-convert to WebP/AVIF
      ]
    });

    // Remove file from local storage after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    // Remove local file even if upload fails to keep server clean
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
};

/**
 * Deletes an asset from Cloudinary using its Public ID
 * @param publicId The unique ID Cloudinary provides upon upload
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    throw new Error("Failed to delete asset from cloud storage");
  }
};