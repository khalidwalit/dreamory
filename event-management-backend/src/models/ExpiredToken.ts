import mongoose, { Document, Schema } from 'mongoose';

export interface IExpiredToken extends Document {
  token: string;
  createdAt: Date;
}

const tokenExpiredSchema = new Schema<IExpiredToken>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Automatically remove after 1 hour
});

// Export the TokenBlacklist model
export const ExpiredToken = mongoose.model<IExpiredToken>('ExpiredToken', tokenExpiredSchema);
