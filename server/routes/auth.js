import express from "express";
import { login, passwordUpdate } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/password", passwordUpdate);

export default router;
