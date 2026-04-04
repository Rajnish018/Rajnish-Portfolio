import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.route";
import skillRoutes from "./routes/skill.route";
import messageRoutes from "./routes/message.routes";
import statsRoutes from "./routes/stats.routes";
import teamRoutes from "./routes/team.routes";
import analyticsRoutes from "./routes/analytics.routes";
import uploadRoutes from "./routes/upload.routes";
import adminRoutes from "./routes/admin.routes";
import experienceRoutes from "./routes/experience.routes";
import { ENV } from "./config/env";



const app = express();

const {VERCEL_FORNTEND_URL,LOCAL_FORNTEND_URL}=ENV;



app.use(cors({
    origin: VERCEL_FORNTEND_URL||LOCAL_FORNTEND_URL, // Adjust this to your frontend URL
    credentials: true,
}));
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/admin",adminRoutes)

export default app;