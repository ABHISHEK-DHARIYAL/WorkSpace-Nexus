import { Router } from "express";
import { HighlightController } from "../controllers/highlightController";
import { authenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", authenticate, checkDb, HighlightController.getAll);
router.get("/:pageId", authenticate, checkDb, HighlightController.getByPage);
router.post("/", authenticate, checkDb, HighlightController.create);

export default router;
