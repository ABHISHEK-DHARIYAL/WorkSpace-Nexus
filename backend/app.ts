import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import { createServer as createViteServer } from "vite";
import routes from "./routes";
import { ENV } from "./config/env";
import { testFirestoreConnection } from "./config/firebase";

export async function createApp() {
  // Test Firestore connection on startup to dynamically verify permission/quota and handle fallback
  await testFirestoreConnection();

  const app = express();

  // Middlewares
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());
  app.use(morgan("dev"));

  // API Routes
  app.use("/api", routes);

  // Vite / Static Serving
  if (ENV.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred",
      error: ENV.NODE_ENV === "development" ? err : {}
    });
  });

  return app;
}
