import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  closeCampaign,
} from "../controllers/campaign.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isOwner } from "../middleware/campaign.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getCampaigns);          // ✅ get all campaigns
router.get("/:id", getCampaignById);    // ✅ get single

/* PROTECTED */
router.post("/", protect, createCampaign);             // ✅ create
router.put("/:id/close", protect, isOwner, closeCampaign); // ✅ close (owner only)

export default router;