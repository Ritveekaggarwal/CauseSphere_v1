import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controllers.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ROUTES */
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;