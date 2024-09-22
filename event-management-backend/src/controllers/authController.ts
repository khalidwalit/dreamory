import { Request, Response } from "express";
import * as authService from "../services/authService"; // Adjust the path as necessary

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body; // Get confirmPassword from request body
    const user = await authService.registerUser(email, password, confirmPassword);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid email format" || 
          error.message === "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters." ||
          error.message === "Passwords do not match") {
        res.status(400).json({ message: error.message }); // Bad Request
      } else {
        res.status(401).json({ message: error.message }); // Unauthorized
      }
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const result = await authService.logoutUser(token);
    res.status(200).json(result);
  }  catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
