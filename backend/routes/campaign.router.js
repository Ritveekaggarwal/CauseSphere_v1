import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaign.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);

/* PROTECTED */
router.post("/", protect, createCampaign);
router.put("/:id", protect, updateCampaign);
router.delete("/:id", protect, deleteCampaign);

export default router;