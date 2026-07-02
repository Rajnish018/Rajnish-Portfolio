import dotenv from 'dotenv';

dotenv.config();


// console.log("Loaded ENV variables:",process.env.PORT);

const commaSeparatedOrigins = process.env.ALLOWED_ORIGINS || process.env.CORS_ALLOWED_ORIGINS || "";
const parsedAllowedOrigins = commaSeparatedOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    VERCEL_FRONTEND_URL: process.env.VERCEL_FRONTEND_URL || process.env.VERCEL_FORNTEND_URL || "",
    VERCEL_FORNTEND_URL: process.env.VERCEL_FRONTEND_URL || process.env.VERCEL_FORNTEND_URL || "",
    LOCAL_FRONTEND_URL: process.env.LOCAL_FRONTEND_URL || process.env.LOCAL_FORNTEND_URL || "",
    LOCAL_FORNTEND_URL: process.env.LOCAL_FRONTEND_URL || process.env.LOCAL_FORNTEND_URL || "",
    ALLOWED_ORIGINS: parsedAllowedOrigins,
    MONGO_URI: process.env.MONGO_URI || "",

    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",

    CLOUD_NAME: process.env.CLOUD_NAME || "",
    CLOUD_KEY: process.env.CLOUD_KEY || "",
    CLOUD_SECRET: process.env.CLOUD_SECRET || "",
}