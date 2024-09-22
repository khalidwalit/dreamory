export interface Event {
  _id: string; // Unique identifier for the event
  name: string; // Name of the event
  startDate: string; // Start date of the event
  endDate: string; // End date of the event
  location: string; // Location of the event
  thumbnail?: File | null; // URL or path to the event poster thumbnail
  status: 'Ongoing' | 'Completed'; // Status of the event
  description?: string; // Optional description of the event
  createdAt: Date; // Date when the event was created
  updatedAt: Date; // Date when the event was last updated
}
