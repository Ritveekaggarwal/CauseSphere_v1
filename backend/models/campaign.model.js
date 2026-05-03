import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g. Health, Education
    urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },

    targetAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },

    image: { type: String }, // URL (you can add upload later)

    endDate: { type: Date, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);