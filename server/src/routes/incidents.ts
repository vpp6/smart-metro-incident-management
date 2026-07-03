import { Router, Request, Response } from "express";
import { query } from "../db";
import { authMiddleware } from "../middleware/auth";
import { auditLogging } from "../middleware/audit";

const router = Router();

router.use(authMiddleware);

function rowToIncident(row: any) {
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    severity: row.severity,
    station: row.station,
    location: row.location,
    description: "",
    incidentType: row.incident_type,
    date: row.date,
    day: row.day,
    time: row.time,
    shift: row.shift,
    reportedBy: row.reported_by,
    detection: row.detection,
    passenger: row.passenger,
    trainOps: row.train_ops,
    evacuation: row.evacuation,
    staff: row.staff_data,
    impact: row.impact,
    reportedAt: row.created_at,
    resolvedAt: null,
    assignedStaff: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/incidents
router.get("/", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    let result;
    if (user.role === "OCC Operator" || user.role === "Administrator") {
      result = await query("SELECT * FROM incidents ORDER BY created_at DESC");
    } else {
      result = await query(
        "SELECT * FROM incidents WHERE station = $1 OR reported_by = $2 ORDER BY created_at DESC",
        [user.station, user.jobNumber]
      );
    }
    res.json(result.rows.map(rowToIncident));
  } catch (err) {
    console.error("[INCIDENTS] GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/incidents/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await query("SELECT * FROM incidents WHERE id = $1 OR code = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }
    const inc = result.rows[0];
    const user = req.user!;
    if (user.role !== "OCC Operator" && user.role !== "Administrator" && inc.station !== user.station && inc.reported_by !== user.jobNumber) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(rowToIncident(inc));
  } catch (err) {
    console.error("[INCIDENTS] GET:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/incidents
router.post("/", auditLogging("CREATE", "incident"), async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const code = `INC-${Date.now().toString(36).toUpperCase()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const user = req.user!;

    const result = await query(
      `INSERT INTO incidents (code, status, severity, station, location, incident_type, date, day, time, shift, reported_by,
        detection, passenger, train_ops, evacuation, staff_data, impact)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [
        code, body.status || "ACTIVE", body.severity, body.station, body.location,
        body.incidentType, body.date, body.day, body.time, body.shift,
        user.jobNumber,
        body.detection ? JSON.stringify(body.detection) : null,
        body.passenger ? JSON.stringify(body.passenger) : null,
        body.trainOps ? JSON.stringify(body.trainOps) : null,
        body.evacuation ? JSON.stringify(body.evacuation) : null,
        body.staff ? JSON.stringify(body.staff) : null,
        body.impact ? JSON.stringify(body.impact) : null,
      ]
    );
    res.status(201).json(rowToIncident(result.rows[0]));
  } catch (err) {
    console.error("[INCIDENTS] POST error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/incidents/:id
router.put("/:id", auditLogging("UPDATE", "incident"), async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = req.user!;

    const existing = await query("SELECT * FROM incidents WHERE id = $1", [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }
    const inc = existing.rows[0];
    if (user.role !== "OCC Operator" && user.role !== "Administrator" && inc.reported_by !== user.jobNumber) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await query(
      `UPDATE incidents SET
        status = $1, severity = $2, station = $3, location = $4, incident_type = $5,
        date = $6, day = $7, time = $8, shift = $9,
        detection = $10, passenger = $11, train_ops = $12, evacuation = $13, staff_data = $14, impact = $15,
        updated_at = NOW()
       WHERE id = $16 RETURNING *`,
      [
        body.status, body.severity, body.station, body.location, body.incidentType,
        body.date, body.day, body.time, body.shift,
        body.detection ? JSON.stringify(body.detection) : null,
        body.passenger ? JSON.stringify(body.passenger) : null,
        body.trainOps ? JSON.stringify(body.trainOps) : null,
        body.evacuation ? JSON.stringify(body.evacuation) : null,
        body.staff ? JSON.stringify(body.staff) : null,
        body.impact ? JSON.stringify(body.impact) : null,
        req.params.id,
      ]
    );
    res.json(rowToIncident(result.rows[0]));
  } catch (err) {
    console.error("[INCIDENTS] PUT error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/incidents/:id
router.delete("/:id", auditLogging("DELETE", "incident"), async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const existing = await query("SELECT * FROM incidents WHERE id = $1", [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }
    if (user.role !== "OCC Operator" && user.role !== "Administrator" && existing.rows[0].reported_by !== user.jobNumber) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await query("DELETE FROM incidents WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("[INCIDENTS] DELETE error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
