import { Router } from "express";
import { WorkspaceHubExportController } from "../controllers/workspaceHubExportController";
import { authenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

// Endpoint triggered on GET /api/export/workspace-hub (or /api/workspace-hub depending on how it's mounted)
// Since we mount under "/export" in the main router, we match /export/workspace-hub
router.get("/workspace-hub", authenticate, checkDb, WorkspaceHubExportController.exportHub);

export default router;
