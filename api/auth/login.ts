import { VercelRequest, VercelResponse } from "@vercel/node";
import { withCors } from "../utils/handler";
import { applyCheckDb, sendSuccess, sendError } from "../utils/middleware";
import { AuthService } from "../../backend/services/authService";

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return sendError(res, "Method not allowed", 405);
  }

  const dbReady = await applyCheckDb(req, res);
  if (!dbReady) return;

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, "Email and password required", 400);
    }

    const result = await AuthService.login({ email, password });
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
});
