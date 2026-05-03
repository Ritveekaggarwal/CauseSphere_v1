import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { config } from "../config/config.js";

/* 🔑 GENERATE TOKEN */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "7d",
  });
};

/* 📝 SIGNUP */
export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      password,
      confirmPassword,
    } = req.body;

    // ❌ check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // ❌ check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      location,
      password: hashed,
    });

    res.status(201).json({
      msg: "User created successfully",
      user: {
        id: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Signup failed" });
  }
};

/* 🔐 LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.firstName + " " + user.lastName, // 🔥 FIX
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};

/* 🚪 LOGOUT */
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
};

/* 👤 GET CURRENT USER */
export const getMe = async (req, res) => {
  const user = req.user;

  res.json({
    user: {
      id: user._id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      phone: user.phone,
      location: user.location,
    },
  });
};