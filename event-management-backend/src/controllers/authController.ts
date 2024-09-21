import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authService from '../services/authService'; // Adjust the path as necessary


export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    
    await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id, // Return the userId
    });
  } catch (error) {
    if ((error as any).code === 11000) { // Handle duplicate key error
      return res.status(400).json({ message: 'Email is already in use' });
    }

    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, userId } = await authService.loginUser(email, password);
    return res.json({ token, userId });
  } catch (error) {
    // if (error.message === 'User not found') {
    //   return res.status(404).json({ message: 'User not found' });
    // } else if (error.message === 'Invalid credentials') {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }
    return res.status(500).json({ message: 'Server error' });
  }
};
