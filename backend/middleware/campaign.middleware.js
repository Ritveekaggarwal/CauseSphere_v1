import Campaign from "../models/campaign.model.js";

export const isOwner = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }

    if (campaign.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    req.campaign = campaign; // optional
    next();
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};