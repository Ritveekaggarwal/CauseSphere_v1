import Razorpay from "razorpay";
import crypto from "crypto";
import Campaign from "../models/campaign.model.js";
import { config } from "../config/config.js";

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

    const body = razorpay_order_id + "|" + razorpay_payment_id;

const expected = crypto
  .createHmac("sha256", config.razorpay.key_secret)
  .update(body)
  .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    // ✅ Save donation
    const campaign = await Campaign.findById(campaignId);

    campaign.donations.push({
      donor: donor || "Anonymous",
      amount,
    });

    campaign.raisedAmount += amount;

    await campaign.save();

    res.json({ msg: "Payment verified & donation saved" });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ msg: "Verification failed" });
  }
};