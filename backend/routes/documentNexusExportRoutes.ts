import { Router } from "express";
import { DocumentNexusExportController } from "../controllers/documentNexusExportController";
import { authenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

// Endpoint triggered on GET /export/document-nexus
router.get("/document-nexus", authenticate, checkDb, DocumentNexusExportController.exportNexus);

export default router;
