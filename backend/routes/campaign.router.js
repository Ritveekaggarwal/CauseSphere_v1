import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  closeCampaign,
  donateToCampaign,
} from "../controllers/campaign.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isOwner } from "../middleware/campaign.middleware.js";
import Campaign from "../models/campaign.model.js"; 


const router = express.Router();

router.get("/", getCampaigns);

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

router.get("/:id", getCampaignById);

router.post("/", protect, createCampaign);
router.put("/:id/close", protect, isOwner, closeCampaign);
router.post("/:id/donate", protect, donateToCampaign);


export default router;