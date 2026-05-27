import { VercelRequest, VercelResponse } from "@vercel/node";
import { withCors } from "../utils/handler";
import { applyAuthenticate, sendSuccess, sendError } from "../utils/middleware";

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "GET") {
    return sendError(res, "Method not allowed", 405);
  }

  const isAuthenticated = applyAuthenticate(req, res);
  if (!isAuthenticated) return;

  sendSuccess(res, { user: (req as any).user });
});
