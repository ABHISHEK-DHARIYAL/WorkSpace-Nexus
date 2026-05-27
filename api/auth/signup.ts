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
    const { email, password, isSocial } = req.body;
    if (!email || !password) {
      return sendError(res, "Email and password required", 400);
    }

    const result = await AuthService.signup({ email, password, isSocial });
    sendSuccess(res, result, 201);
  } catch (error: any) {
    sendError(
      res,
      error.message,
      error.message === "User already exists" ? 409 : 400
    );
  }
});
