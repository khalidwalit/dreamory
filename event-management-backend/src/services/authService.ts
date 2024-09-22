// src/services/authService.ts

import { User } from "../models/User"; // Adjust the import according to your User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ExpiredToken } from "../models/ExpiredToken";


const JWT_SECRET = process.env.JWT_SECRET as string;

const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  );
};

export const registerUser = async (email: string, password: string, confirmPassword: string) => {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!isValidPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
    );
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("Email already exists");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  
  return newUser;
};


export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials"); // Keep it generic
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials"); // Keep it generic
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "3d" }
  );

  return { token, userId: user._id }; // Return userId along with token
};

export const logoutUser = async (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Add the token to the blacklist (you can set an expiration if needed)
    const blacklistedToken = new ExpiredToken({ token });
    await blacklistedToken.save();

    return { message: "Logged out successfully" };
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const authenticateUser = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
