import { Router } from "express";
import { DocPageController } from "../controllers/docPageController";
import { authenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", authenticate, checkDb, DocPageController.getAll);
router.get("/:id", authenticate, checkDb, DocPageController.getById);
router.post("/", authenticate, checkDb, DocPageController.create);
router.put("/:id", authenticate, checkDb, DocPageController.update);
router.delete("/:id", authenticate, checkDb, DocPageController.delete);

export default router;
