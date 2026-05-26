import { Router } from "express";
import { SearchController } from "../controllers/searchController";
import { authenticate } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", authenticate, checkDb, SearchController.search);

export default router;
