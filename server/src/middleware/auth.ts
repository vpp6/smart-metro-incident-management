import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "metro-dev-secret-change-in-production";

export interface AuthUser {
  id: string;
  jobNumber: string;
  name: string;
  role: string;
  station: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "12h" });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function stationAuth(allowedStations: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (allowedStations.includes(req.user.station) || req.user.role === "OCC Operator" || req.user.role === "Station Manager") {
      return next();
    }
    if (req.user.station === req.params.station || req.user.station === "All Stations") {
      return next();
    }
    return res.status(403).json({ error: "Forbidden: insufficient station access" });
  };
}
