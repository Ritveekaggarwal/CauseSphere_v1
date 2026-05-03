import Campaign from "../models/campaign.model.js";
import { categoryImages } from "../utils/categoryImage.js";

/* ➕ CREATE CAMPAIGN */
export const createCampaign = async (req, res) => {
  try {
    const {
      name,
      description,
      goal,
      category,
      endDate,
      email,
      phone,
      payoutMethod,
      upiId,
      idDoc,
    } = req.body;

    const campaign = await Campaign.create({
      name,
      description,
      goal,
      category,
      image: categoryImages[category], // 🔥 auto image
      endDate,
      email,
      phone,
      payoutMethod,
      upiId,
      idDoc,
      createdBy: req.user._id,
    });

    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Create campaign failed" });
  }
};

/* 📥 GET ALL */
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive: true })
      .populate("createdBy", "firstName lastName");

    res.json(campaigns);
  } catch {
    res.status(500).json({ msg: "Fetch failed" });
  }
};

/* 📄 GET ONE */
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ msg: "Not found" });

    res.json(campaign);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

/* ❌ CLOSE CAMPAIGN */
export const closeCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ msg: "Not found" });

    if (campaign.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    campaign.isActive = false;
    await campaign.save();

    res.json({ msg: "Campaign closed" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};