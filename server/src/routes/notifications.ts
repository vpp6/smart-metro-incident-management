import { Router, Request, Response } from "express";
import { query } from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await query(
      `SELECT * FROM notifications
       WHERE user_job_number = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.jobNumber]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("[NOTIFICATIONS] GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/unread-count", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await query(
      `SELECT COUNT(*) FROM notifications WHERE user_job_number = $1 AND read = false`,
      [user.jobNumber]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("[NOTIFICATIONS] count error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/read", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    await query(
      `UPDATE notifications SET read = true WHERE id = $1 AND user_job_number = $2`,
      [req.params.id, user.jobNumber]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[NOTIFICATIONS] mark read error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/read-all", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    await query(
      `UPDATE notifications SET read = true WHERE user_job_number = $1 AND read = false`,
      [user.jobNumber]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[NOTIFICATIONS] mark all read error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

export async function createNotification(data: {
  userJobNumber: string;
  title: string;
  message: string;
  type?: string;
  incidentId?: string;
  incidentCode?: string;
}) {
  try {
    await query(
      `INSERT INTO notifications (user_job_number, title, message, type, incident_id, incident_code)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [data.userJobNumber, data.title, data.message, data.type || "info", data.incidentId || null, data.incidentCode || null]
    );
  } catch (err) {
    console.error("[NOTIFICATIONS] create error:", err);
  }
}
