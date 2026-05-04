import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
  },
  donorUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  donorName: {
    type: String,
    default: "Anonymous",
  },
  amount: Number,
}, { timestamps: true });



export default mongoose.model("Donation", donationSchema);