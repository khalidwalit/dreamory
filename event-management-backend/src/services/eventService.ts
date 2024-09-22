import { User } from '../models/User'; // Adjust the import based on your project structure
import { Event } from "../models/Event";
import bcrypt from "bcryptjs";

export const createEvent = async (eventData: any) => {
  const event = new Event({ ...eventData });
  await event.save();
  return event;
};



export const updateEvent = async (eventId: string, eventData: any) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  Object.keys(eventData).forEach((key) => {
    if (eventData[key] !== undefined) {
      (event as any)[key] = eventData[key];
    }
  });

  await event.save();
  return event;
};


export const deleteEvent = async (eventId: string, userPassword: string, userId: string) => {
  // Verify the user's password
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(userPassword, user.password);
  console.log(isPasswordValid)
  if (!isPasswordValid) throw new Error("Invalid password");

  // Proceed to delete the event
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) throw new Error("Event not found");
  return event;
};

export const getAllEvents = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const events = await Event.find()
    .skip(skip)
    .limit(limit)
    .exec();

  const totalEvents = await Event.countDocuments();

  return {
    totalEvents,
    events,
  };
};

export const getEventById = async (id: string) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};
