export interface Event {
  _id: string;                  // Unique identifier for the event
  name: string;                // Name of the event
  startDate: Date;            // Start date of the event
  endDate: Date;              // End date of the event
  location: string;           // Location of the event
  thumbnail?: string;   // URL or path to the event poster thumbnail
  status: 'Ongoing' | 'Completed'; // Status of the event
  description?: string;       // Optional description of the event
  createdAt: Date;            // Date when the event was created
  updatedAt: Date;            // Date when the event was last updated
}
