// src/services/authService.ts

import { User } from '../models/User'; // Adjust the import according to your User model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  console.log('apa')
  const user = await User.findOne({ email });
  console.log(user)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  console.log('wat')
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  console.log('Token generated:', token);
  const decodedToken = jwt.decode(token);
  console.log('Decoded Token:', decodedToken);
  return { token, userId: user._id };
};

export const authenticateUser = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
