import { createApp } from "../backend/app";

let appPromise: any = null;

export default async function handler(req: any, res: any) {
  // Ensure we recognize standard production delivery in serverless environments
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "production";
  }
  
  try {
    if (!appPromise) {
      appPromise = createApp();
    }
    const app = await appPromise;
    // Delegate the request execution directly to our Express app
    return app(req, res);
  } catch (err: any) {
    console.error("[Vercel Handler Error]:", err);
    res.status(500).json({
      message: "Vercel serverless function execution failed on startup.",
      error: err?.message || String(err)
    });
  }
}
