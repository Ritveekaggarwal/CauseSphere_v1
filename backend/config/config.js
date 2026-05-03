import dotenv from "dotenv";

dotenv.config();

/* 🔍 REQUIRED ENV VARIABLES */
const requiredEnv = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
];

/* ❌ CHECK MISSING ENV */
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});

/* ✅ EXPORT CLEAN CONFIG */
export const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || "development",
};