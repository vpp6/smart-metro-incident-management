import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { initDatabase } from "./db-schema";
import { seedStaff } from "./seed";
import authRoutes from "./routes/auth";
import incidentRoutes from "./routes/incidents";
import staffRoutes from "./routes/staff";
import auditRoutes from "./routes/audit";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "5mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests" },
});
app.use("/api/", limiter);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/audit", auditRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Serve built client in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../../dist");
  app.use(express.static(clientPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Start
async function start() {
  try {
    await initDatabase();
    await seedStaff();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SERVER] Running on port ${PORT} | ENV=${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("[SERVER] Startup error:", err);
    process.exit(1);
  }
}

start();
