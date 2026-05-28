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
    
    // Robust alignment of req.url using Vercel routing headers to guarantee physical Express route matches
    let originalPath = "";
    
    if (typeof req.headers["x-vercel-forwarded-path"] === "string" && req.headers["x-vercel-forwarded-path"]) {
      originalPath = req.headers["x-vercel-forwarded-path"];
    } else if (typeof req.headers["x-forwarded-uri"] === "string" && req.headers["x-forwarded-uri"]) {
      originalPath = req.headers["x-forwarded-uri"];
    } else if (typeof req.headers["x-matched-path"] === "string" && req.headers["x-matched-path"]) {
      const match = req.headers["x-matched-path"];
      // Avoid using x-matched-path if it's just the serverless entrypoint index file path itself
      if (!match.endsWith("index.ts") && !match.endsWith("index.js") && !match.endsWith("index.cjs") && !match.includes("/api/index")) {
        originalPath = match;
      }
    }

    if (originalPath) {
      const urlObj = new URL(req.url, "http://localhost");
      let alignedUrl = originalPath;
      if (!alignedUrl.startsWith("/api") && alignedUrl.startsWith("/")) {
        alignedUrl = "/api" + alignedUrl;
      }
      alignedUrl = alignedUrl + urlObj.search;
      console.log(`[Vercel Serverless Routing] Aligning req.url from "${req.url}" to: "${alignedUrl}"`);
      req.url = alignedUrl;
    } else {
      // Direct invocation fallback: Prefix with /api if missing to match Express routes
      if (req.url && !req.url.startsWith("/api") && !req.url.startsWith("/api/")) {
        const urlObj = new URL(req.url, "http://localhost");
        const alignedUrl = "/api" + (urlObj.pathname.startsWith("/") ? "" : "/") + urlObj.pathname + urlObj.search;
        console.log(`[Vercel Serverless Routing] Prefix missing "/api". Aligning req.url from "${req.url}" to: "${alignedUrl}"`);
        req.url = alignedUrl;
      } else {
        console.log(`[Vercel Serverless Routing] Invoking handler directly for req.url: "${req.url}"`);
      }
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
