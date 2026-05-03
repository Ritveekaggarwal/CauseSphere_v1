import Campaign from "../models/campaign.model.js";

/* ➕ CREATE CAMPAIGN (protected) */
export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      urgency,
      targetAmount,
      image,
      endDate,
    } = req.body;

    const campaign = await Campaign.create({
      title,
      description,
      category,
      urgency,
      targetAmount,
      image,
      endDate,
      createdBy: req.user._id, // from auth middleware
    });

    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Create campaign failed" });
  }
};

/* 📥 GET ALL CAMPAIGNS (public) */
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive: true })
      .populate("createdBy", "name");

    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed" });
  }
};

/* 📄 GET SINGLE CAMPAIGN */
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("createdBy", "name");

    if (!campaign) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

/* ✏️ UPDATE CAMPAIGN (owner only) */
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ msg: "Not found" });

    if (campaign.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    Object.assign(campaign, req.body);

    await campaign.save();

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};

/* ❌ DELETE (or CLOSE) CAMPAIGN */
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ msg: "Not found" });

    if (campaign.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    campaign.isActive = false;
    await campaign.save();

    res.json({ msg: "Campaign closed" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};