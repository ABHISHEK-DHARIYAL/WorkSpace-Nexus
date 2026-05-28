import { Router } from "express";
import { ListingController } from "../controllers/listingController";
import { authenticate, optionalAuthenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", authenticate, checkDb, ListingController.getAll);
router.get("/workspace/:workspaceId", authenticate, checkDb, ListingController.getByWorkspace);
router.get("/search/:workspaceId", authenticate, checkDb, ListingController.search);
router.get("/:id", optionalAuthenticate, checkDb, ListingController.getById);
router.post("/", authenticate, checkDb, ListingController.create);
router.put("/:id", authenticate, checkDb, ListingController.update);
router.delete("/:id", authenticate, checkDb, ListingController.delete);

export default router;
