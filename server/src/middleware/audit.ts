import { Request, Response, NextFunction } from "express";
import { query } from "../db";

export function auditLogging(action: string, entityType: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      if (res.statusCode < 400) {
        const entityId = req.params.id || body?.id || body?.code || null;
        query(
          `INSERT INTO audit_log (action, entity_type, entity_id, user_job_number, user_name, details, ip_address)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            action,
            entityType,
            entityId,
            req.user?.jobNumber || null,
            req.user?.name || null,
            JSON.stringify({ method: req.method, path: req.path }),
            req.ip,
          ]
        ).catch((err) => console.error("[AUDIT] Failed to log:", err.message));
      }
      return originalJson(body);
    };
    next();
  };
}
