// src/services/eventService.ts

import { Event } from '../models/Event'; // Adjust the import according to your Event model

export const createEvent = async (eventData: any) => {
  const newEvent = new Event(eventData);
  return await newEvent.save();
};

export const getAllEvents = async (filter: any = {}) => {
  return await Event.find(filter);
};

export const getEventById = async (eventId: string) => {
  return await Event.findById(eventId);
};

export const updateEvent = async (eventId: string, updatedData: any) => {
  return await Event.findByIdAndUpdate(eventId, updatedData, { new: true });
};

export const deleteEvent = async (eventId: string) => {
  return await Event.findByIdAndDelete(eventId);
};
