import { Request, Response } from "express";
import { Event } from "../models/Event";
import * as eventService from "../services/eventService"; // Import service layer

export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData = req.body;

    const thumbnailPath = req.file ? req.file.path : null;

    const newEvent = await eventService.createEvent({
      ...eventData,
      thumbnail: thumbnailPath, // Store the file path in the database
    });

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedEvent = await eventService.deleteEvent(id);
    res.status(200).json({ message: "Event deleted successfully", event: deletedEvent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, startDate, endDate, location, status } = req.body;
  const thumbnail = req.file ? req.file.path : null;

  try {
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const eventData = {
      name: name || event.name,
      startDate: startDate || event.startDate,
      endDate: endDate || event.endDate,
      location: location || event.location,
      thumbnail: thumbnail || event.thumbnail,
      status: status || event.status,
    };

    const updatedEvent = await eventService.updateEvent(id, eventData);

    res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const listEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventService.getAllEvents(); // Call service
    res.json(events); // Respond with event data
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id); // Call service
    res.json(event); // Respond with event data
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};


