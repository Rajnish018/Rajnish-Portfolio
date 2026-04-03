import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env";

const{ CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } = ENV;


cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOUD_SECRET,
  secure: true, 
});

export default cloudinary;