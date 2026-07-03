import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { generateToken } from "../middleware/auth";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { jobNumber, password } = req.body;

  if (!jobNumber || !password) {
    return res.status(400).json({ error: "Job number and password required" });
  }

  try {
    const result = await query("SELECT * FROM staff WHERE job_number = $1", [jobNumber.toUpperCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid job number or password" });
    }

    const staff = result.rows[0];
    const valid = await bcrypt.compare(password, staff.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid job number or password" });
    }

    const user = {
      id: staff.id,
      jobNumber: staff.job_number,
      name: staff.name,
      role: staff.role,
      station: staff.station,
    };

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: staff.id,
        jobNumber: staff.job_number,
        name: staff.name,
        role: staff.role,
        station: staff.station,
      },
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(header.slice(7), process.env.JWT_SECRET || "metro-dev-secret-change-in-production") as any;
    const result = await query("SELECT id, job_number, name, role, station FROM staff WHERE job_number = $1", [decoded.jobNumber]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    const s = result.rows[0];
    res.json({
      id: s.id, jobNumber: s.job_number, name: s.name, role: s.role, station: s.station,
    });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
