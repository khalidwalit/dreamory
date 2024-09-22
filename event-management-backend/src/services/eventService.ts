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


export const deleteEvent = async (eventId: string) => {
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) throw new Error("Event not found");
  return event;
};

export const getAllEvents = async (status?: string) => {
  const filter = status ? { status } : {};
  const events = await Event.find(filter);
  return events;
};

export const getEventById = async (id: string) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};
