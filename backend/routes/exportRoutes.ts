import { Router } from "express";
import { ExportController } from "../controllers/exportController";
import { authenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

// Retrieve list of all exportable user projects
router.get("/all-projects", authenticate, checkDb, ExportController.allProjects);

// Trigger a single project package ZIP download
router.get("/project/:id", authenticate, checkDb, ExportController.getById);

export default router;
