import express from "express";
import { getUser, getUsersExceptId } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/users/:id", verifyToken, getUsersExceptId);
router.get("/:id", verifyToken, getUser);

export default router;
