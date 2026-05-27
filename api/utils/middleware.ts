import { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./firebase";
import jwt from "jsonwebtoken";

export async function applyCheckDb(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb();
    if (!db) {
      res
        .status(503)
        .json({
          status: "error",
          message: "Database starting up... please retry in a moment.",
        });
      return false;
    }
    return true;
  } catch (error: any) {
    console.error("DB initialization error:", error);
    res
      .status(503)
      .json({ status: "error", message: "Database connection failed" });
    return false;
  }
}

export function applyAuthenticate(
  req: VercelRequest,
  res: VercelResponse
): boolean {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    (req as any).user = decoded;
    return true;
  } catch (error) {
    res.status(401).json({ status: "error", message: "Invalid token" });
    return false;
  }
}

export function sendSuccess(res: VercelResponse, data: any, status = 200) {
  res.status(status).json({ status: "success", data });
}

export function sendError(res: VercelResponse, message: string, status = 400) {
  res.status(status).json({ status: "error", message });
}
