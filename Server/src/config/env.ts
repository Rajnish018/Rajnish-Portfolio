import dotenv from 'dotenv';

dotenv.config();


// console.log("Loaded ENV variables:",process.env.PORT);

export const ENV={
    NODE_ENV: process.env.NODE_ENV ,
    PORT: process.env.PORT ,
    MONGO_URI: process.env.MONGO_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "",

    CLOUD_NAME: process.env.CLOUD_NAME || "",
    CLOUD_KEY: process.env.CLOUD_KEY || "",
    CLOUD_SECRET: process.env.CLOUD_SECRET || "",
}