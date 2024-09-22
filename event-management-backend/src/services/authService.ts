// src/services/authService.ts

import { User } from "../models/User"; // Adjust the import according to your User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ExpiredToken } from "../models/ExpiredToken";


const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  const decodedToken = jwt.decode(token);
  return { token, userId: user._id };
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
