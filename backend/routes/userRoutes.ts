import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticate, isAdmin } from "../middleware/auth";
import { checkDb } from "../middleware/checkDb";

const router = Router();

router.get("/", authenticate, isAdmin, checkDb, UserController.getAll);

export default router;
