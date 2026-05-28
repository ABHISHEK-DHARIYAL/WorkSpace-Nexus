import { createApp } from "./app";
import { ENV } from "./config/env";

async function startServer() {
  const app = await createApp();
  const PORT = Number(ENV.PORT);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT} in ${ENV.NODE_ENV} mode`);
    
    // Pulse log
    if (ENV.NODE_ENV === "production") {
      setInterval(() => console.log(`[${new Date().toISOString()}] Heartbeat port ${PORT}`), 60000);
    }
  });
}

startServer().catch(err => {
  console.error("CRITICAL SERVER START FAILURE:", err);
  process.exit(1);
});
