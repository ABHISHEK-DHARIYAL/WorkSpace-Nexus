import { VercelRequest, VercelResponse } from "@vercel/node";
import { withCors } from "../utils/handler";
import {
  applyCheckDb,
  applyAuthenticate,
  sendSuccess,
  sendError,
} from "../utils/middleware";
import { AuthService } from "../../backend/services/authService";

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "DELETE") {
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  const dbReady = await applyCheckDb(req, res);
  if (!dbReady) return;

  const isAuthenticated = applyAuthenticate(req, res);
  if (!isAuthenticated) return;

  try {
    const email = (req as any).user.email;
    const result = await AuthService.deleteAccount(email);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message);
  }
});
