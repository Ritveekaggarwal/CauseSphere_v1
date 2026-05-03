import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    goal: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["medical", "education", "animals", "environment", "ngo", "other"],
      required: true,
    },

    image: {
      type: String, // auto from category
    },

    endDate: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    payoutMethod: {
      type: String,
      enum: ["upi"],
      default: "upi",
    },

    upiId: {
      type: String,
      required: true,
    },

    idDoc: {
      type: String, // later for upload
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    raisedAmount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);