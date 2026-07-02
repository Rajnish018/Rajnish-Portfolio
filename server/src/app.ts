import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.route";
import skillRoutes from "./routes/skill.route";
import messageRoutes from "./routes/message.routes";
import statsRoutes from "./routes/stats.routes";
import teamRoutes from "./routes/team.routes";
import analyticsRoutes from "./routes/analytics.routes";
import UploadRoute from './routes/upload.route'
import adminRoutes from "./routes/admin.routes";
import experienceRoutes from "./routes/experience.routes";
import linksRoutes from './routes/link.route'
import { ENV } from "./config/env";

const app = express();

const allowedOrigins = [
  ...ENV.ALLOWED_ORIGINS,
  ENV.VERCEL_FRONTEND_URL,
  ENV.VERCEL_FORNTEND_URL,
  ENV.LOCAL_FRONTEND_URL,
  ENV.LOCAL_FORNTEND_URL,
].filter(Boolean) as string[];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedLocalhost = [
      "http://localhost:",
      "http://127.0.0.1:",
      "https://localhost:",
      "https://127.0.0.1:",
    ].some((prefix) => origin.startsWith(prefix));

    if (allowedOrigins.includes(origin) || allowedLocalhost) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", UploadRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/identity",linksRoutes)


export default app;