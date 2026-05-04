import Campaign from "../models/campaign.model.js";
import { categoryImages } from "../utils/categoryImage.js";



export const createCampaign = async (req, res) => {
  try {
    const existing = await Campaign.findOne({ createdBy: req.user._id });

    if (existing) {
      return res.status(400).json({
        msg: "You already have a campaign",
      });
    }

    const campaign = await Campaign.create({
      ...req.body,
      image: categoryImages[req.body.category],
      createdBy: req.user._id,
    });

    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Create campaign failed" });
  }
};
export const getCampaigns = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = { isActive: true };

    // 🔍 SEARCH
    if (search) {
      query.$text = { $search: search };
    }

    // 🎯 CATEGORY
    if (category && category !== "All") {
      query.category = category;
    }

    // 🔄 SORT
    let sortOption = {};

    if (sort === "funded") sortOption = { raisedAmount: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "ending") sortOption = { endDate: 1 };

    const campaigns = await Campaign.find(query)
      .sort(sortOption)
      .limit(50);

    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed" });
  }
};
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ msg: "Not found" });

    res.json(campaign);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};
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
export const donateToCampaign = async (req, res) => {
  try {
    const { amount, donor } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    campaign.donations.push({
      donor: donor || "Anonymous", // 👈 fallback
      amount,
    });

    campaign.raisedAmount += amount;

    await campaign.save();

    res.json({ msg: "Donation successful", campaign });
  } catch (err) {
    console.error("DONATION ERROR:", err);
    res.status(500).json({ msg: "Donation failed" });
  }
};
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    if (campaign.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // ✅ update only allowed fields
    const allowed = [
      "name",
      "description",
      "goal",
      "endDate",
      "email",
      "phone",
      "upiId",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });

    await campaign.save();

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};