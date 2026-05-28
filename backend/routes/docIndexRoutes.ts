import { Router } from "express";
import { DocIndexController } from "../controllers/docIndexController";
import { authenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", authenticate, checkDb, DocIndexController.getAll);
router.get("/:id", authenticate, checkDb, DocIndexController.getById);
router.post("/", authenticate, checkDb, DocIndexController.create);
router.put("/:id", authenticate, checkDb, DocIndexController.update);
router.delete("/:id", authenticate, checkDb, DocIndexController.delete);

export default router;
