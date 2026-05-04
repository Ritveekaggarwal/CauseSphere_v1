import Razorpay from "razorpay";
import crypto from "crypto";
import Campaign from "../models/campaign.model.js";
import { config } from "../config/config.js";
import Donation from "../models/donation.model.js";
import Transaction from "../models/transaction.model.js";

const razorpay = new Razorpay({
  key_id: config.razorpay.key_id,
  key_secret: config.razorpay.key_secret,
});
/* 🧾 CREATE ORDER */
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ msg: "Order creation failed" });
  }
};

/* 🔐 VERIFY PAYMENT + SAVE DONATION */


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      campaignId,
      amount,
      donor,
    } = req.body;

    // (keep your signature verification)

    // 🔥 1. SAVE DONATION
    const donation = await Donation.create({
      campaign: campaignId,
      donorUser: req.user?._id,
      donorName: donor || "Anonymous",
      amount,
    });

    // 🔥 2. SAVE TRANSACTION
    await Transaction.create({
      campaign: campaignId,
      donation: donation._id,
      amount,
      status: "success",
      razorpay_order_id,
      razorpay_payment_id,
    });

    // 🔥 3. UPDATE CAMPAIGN SUMMARY ONLY
    const campaign = await Campaign.findById(campaignId);
    campaign.raisedAmount += amount;
    await campaign.save();

    res.json({ msg: "Payment verified & saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Verification failed" });
  }
};