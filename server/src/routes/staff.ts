import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { authMiddleware } from "../middleware/auth";
import { auditLogging } from "../middleware/audit";

const router = Router();
router.use(authMiddleware);

function isAdmin(user: { role: string }) {
  return user.role === "OCC Operator" || user.role === "Administrator";
}

function canModifyStaff(user: { role: string }) {
  return user.role === "OCC Operator";
}

// GET /api/staff
router.get("/", async (req: Request, res: Response) => {
  if (!isAdmin(req.user!)) {
    return res.status(403).json({ error: "Forbidden: admins only" });
  }
  try {
    const result = await query("SELECT id, job_number, name, role, station FROM staff ORDER BY name");
    res.json(result.rows.map((r: any) => ({ id: r.id, jobNumber: r.job_number, name: r.name, role: r.role, station: r.station })));
  } catch (err) {
    console.error("[STAFF] GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/staff
router.post("/", auditLogging("CREATE", "staff"), async (req: Request, res: Response) => {
  if (!canModifyStaff(req.user!)) {
    return res.status(403).json({ error: "Forbidden: OCC operators only" });
  }
  const { jobNumber, name, password, role, station } = req.body;
  if (!jobNumber || !name || !password || !role || !station) {
    return res.status(400).json({ error: "All fields required" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO staff (job_number, name, password_hash, role, station) VALUES ($1, $2, $3, $4, $5) RETURNING id, job_number, name, role, station",
      [jobNumber.toUpperCase(), name, hash, role, station]
    );
    const r = result.rows[0];
    res.status(201).json({ id: r.id, jobNumber: r.job_number, name: r.name, role: r.role, station: r.station });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Job number already exists" });
    }
    console.error("[STAFF] POST error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/staff/:id
router.delete("/:id", auditLogging("DELETE", "staff"), async (req: Request, res: Response) => {
  if (!canModifyStaff(req.user!)) {
    return res.status(403).json({ error: "Forbidden: OCC operators only" });
  }
  try {
    const result = await query("DELETE FROM staff WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("[STAFF] DELETE error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
