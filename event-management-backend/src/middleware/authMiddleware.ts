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

  const blacklistedToken = await ExpiredToken.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token expired" });
  }

  console.log(token);

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Token expired" });
      }
      const decoded1 = jwt.decode(token);

      console.log(decoded1);
      req.userId = decoded.id;
      next();
    }
  );
};
