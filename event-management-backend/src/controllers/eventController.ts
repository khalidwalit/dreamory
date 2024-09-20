import { Request, Response } from 'express';
import { Event } from '../models/Event';

export const createEvent = async (req: Request, res: Response) => {
  const { name, startDate, endDate, location, thumbnail } = req.body;
  const newEvent = new Event({ name, startDate, endDate, location, thumbnail });
  
  await newEvent.save();
  res.status(201).json(newEvent);
};

export const listEvents = async (req: Request, res: Response) => {
  const events = await Event.find();
  res.json(events);
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, location, thumbnail ,status} = req.body;

    // Find the event by ID and update its fields
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { name, startDate, endDate, location, thumbnail , status},
      { new: true } // This option returns the updated document
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add more CRUD operations (update, delete, filter) as needed
