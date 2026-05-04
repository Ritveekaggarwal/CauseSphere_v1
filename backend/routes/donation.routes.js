import express from "express";
import { getDonorDashboard } from "../controllers/donation.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, getDonorDashboard);

export default router;