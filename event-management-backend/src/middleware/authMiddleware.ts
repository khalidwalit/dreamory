import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ExpiredToken } from "../models/ExpiredToken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Extend Request interface
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Check if the token is blacklisted
  const blacklistedToken = await ExpiredToken.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token has been blacklisted" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Use decoded object directly
    req.userId = (decoded as { id: string }).id; // Cast for better type safety
    next();
  });
};
