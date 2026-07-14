import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendForgotPasswordEmail } from "../mail/mail.service";

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

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "A vaild email is required" });
    }

    const normalisedEmail=email.trim().toLowerCase();
    const user = await User.findOne({ email:normalisedEmail });

    if (!user || user.role!=="admin") {
      return res.status(403).json({ message: "Only admin users can reset password" });
    }


    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const resetUrl=`${ process.env.LOCAL_FRONTEND_URL 
      // ||process.env.VERCEL_FORNTEND_URL
    }/reset-password?token=${token}`;

    console.log(resetUrl)

    await sendForgotPasswordEmail(user.email, resetUrl);

    console.log(`Password reset token for ${email}: ${token}`);

    res.json({ message: "Reset link has been sent successfully" });
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