import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: 'Ongoing' | 'Completed';
  thumbnail: string;
}

const EventSchema: Schema<IEvent> = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Ongoing' },
  thumbnail: { type: String },
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);
