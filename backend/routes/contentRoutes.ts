import { Router } from "express";
import { ContentController } from "../controllers/contentController";
import { authenticate, isAdmin } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", checkDb, ContentController.getAll);
router.get("/:slug", checkDb, ContentController.getBySlug);
router.post("/", authenticate, isAdmin, checkDb, ContentController.create);
router.delete("/:id", authenticate, isAdmin, checkDb, ContentController.delete);

export default router;
