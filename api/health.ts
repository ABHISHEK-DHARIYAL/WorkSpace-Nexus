import { VercelRequest, VercelResponse } from "@vercel/node";
import { withCors } from "../utils/handler";
import { sendSuccess } from "../utils/middleware";

export default withCors(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});
