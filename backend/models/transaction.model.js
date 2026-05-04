import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
  },
  amount: Number,
  status: String,
  razorpay_order_id: String,
  razorpay_payment_id: String,
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);