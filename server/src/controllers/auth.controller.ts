import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ---------------- REGISTER ----------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    console.log("Registering user:", { name, email }); // Debug log

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });



    res.status(201).json({
        user: {
            _id: user._id,
      name: user.name,
      email: user.email,
        },
      token: generateToken(user._id.toString()),
      message: "New user registered successfully",
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email, password); // Debug log

    const user = await User.findOne({ email });

    if(!user) {
        console.warn("Login failed: User not found for email", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }   

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        console.warn("Login failed: Incorrect password for email", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user:{
      _id: user._id,
      name: user.name,
      email: user.email,
      },
      token: generateToken(user._id.toString()),
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET PROFILE ----------------
export const getProfile = async (req: any, res: Response) => {
  res.json(req.user);
};

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If the account exists, a reset link has been sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    console.log(`Password reset token for ${email}: ${token}`);

    res.json({ message: "If the account exists, a reset link has been sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGOUT ----------------
export const logoutUser = async (_req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
};

// ---------------- REFRESH TOKEN ----------------
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const newToken = generateToken(decoded.id);

    res.json({ token: newToken, message: "Token refreshed successfully" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};