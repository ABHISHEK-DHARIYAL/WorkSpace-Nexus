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
  if (req.method !== "PUT") {
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  const dbReady = await applyCheckDb(req, res);
  if (!dbReady) return;

  const isAuthenticated = applyAuthenticate(req, res);
  if (!isAuthenticated) return;

  try {
    const { password } = req.body;
    const email = (req as any).user.email;

    if (!password || password.length < 6) {
      return sendError(res, "Password must be at least 6 characters long", 400);
    }

    const result = await AuthService.updatePassword(
      email,
      password,
      (req as any).user.role
    );
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message);
  }
});
