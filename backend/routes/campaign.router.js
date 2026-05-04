import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  closeCampaign,
} from "../controllers/campaign.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isOwner } from "../middleware/campaign.middleware.js";
import Campaign from "../models/campaign.model.js"; // 🔥 required

const router = express.Router();

/* PUBLIC */
router.get("/", getCampaigns);

/* 🔥 ADD THIS HERE (IMPORTANT POSITION) */
router.get("/my", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      createdBy: req.user._id,
    });


    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching campaign" });
  }
});

/* PUBLIC */
router.get("/:id", getCampaignById);

/* PROTECTED */
router.post("/", protect, createCampaign);
router.put("/:id/close", protect, isOwner, closeCampaign);

export default router;