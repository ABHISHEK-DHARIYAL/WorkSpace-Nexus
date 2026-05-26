import { Router } from "express";
import { PageController } from "../controllers/pageController";
import { AnnotationController } from "../controllers/annotationController";
import { VersionController } from "../controllers/versionController";
import { authenticate, optionalAuthenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", authenticate, checkDb, PageController.getAll);
router.get("/:listingId", optionalAuthenticate, checkDb, PageController.getByListing);
router.get("/workspace/:workspaceId", authenticate, checkDb, PageController.getByWorkspace);
router.post("/", authenticate, checkDb, PageController.create);
router.put("/:id", authenticate, checkDb, PageController.update);
router.delete("/:id", authenticate, checkDb, PageController.delete);

// Annotations
router.get("/:pageId/annotations", authenticate, checkDb, AnnotationController.getByPage);
router.post("/annotations", authenticate, checkDb, AnnotationController.create);
router.put("/annotations/:id", authenticate, checkDb, AnnotationController.update);
router.delete("/annotations/:id", authenticate, checkDb, AnnotationController.delete);

// Versions
router.get("/:pageId/versions", authenticate, checkDb, VersionController.getByPage);
router.post("/versions", authenticate, checkDb, VersionController.create);

export default router;
