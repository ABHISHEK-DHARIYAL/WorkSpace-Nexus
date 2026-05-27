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
    
    // Normalize req.url using Vercel router headers so Express routing matches the original URL perfectly.
    // This is vital when rewrites map '/api/(.*)' -> '/api/index.ts'
    const originalPath = req.headers["x-vercel-forwarded-path"] || req.headers["x-matched-path"] || req.headers["x-forwarded-uri"];
    if (originalPath && typeof originalPath === "string") {
      const urlObj = new URL(req.url, "http://localhost");
      const alignedUrl = originalPath + urlObj.search;
      console.log(`[Vercel Serverless Routing] Aligning req.url from "${req.url}" to original path: "${alignedUrl}"`);
      req.url = alignedUrl;
    } else {
      console.log(`[Vercel Serverless Routing] Invoking handler directly for req.url: "${req.url}"`);
    }

    // Delegate the request execution directly to our Express app and wait for completion
    return new Promise<void>((resolve, reject) => {
      res.on("finish", resolve);
      res.on("close", resolve);
      res.on("error", (err: any) => {
        console.error("[Vercel Response Stream Error]:", err);
        reject(err);
      });
      app(req, res);
    });
  } catch (err: any) {
    console.error("[Vercel Handler Error]:", err);
    res.status(500).json({
      message: "Vercel serverless function execution failed on startup.",
      error: err?.message || String(err)
    });
  }
}
