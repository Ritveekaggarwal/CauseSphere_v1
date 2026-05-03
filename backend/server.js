import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { config } from "./config/config.js";


import authRoutes from "./routes/auth.routes.js";
import campaignRoutes from "./routes/campaign.router.js";




dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});