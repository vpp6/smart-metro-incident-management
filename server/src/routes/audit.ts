import { Router, Request, Response } from "express";
import { query } from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  if (req.user?.role !== "OCC Operator" && req.user?.role !== "Administrator") {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    const result = await query(
      "SELECT * FROM audit_log ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    res.json(result.rows.map((r: any) => ({
      id: r.id,
      action: r.action,
      entityType: r.entity_type,
      entityId: r.entity_id,
      userJobNumber: r.user_job_number,
      userName: r.user_name,
      details: r.details,
      ipAddress: r.ip_address,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error("[AUDIT] GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
