import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import useEventQueries from "../hooks/useEventQueries";
import { Event } from "../types/Event";
import EventForm from "./EventForm";
type EventFormInputs = Omit<Event, "createdAt" | "updatedAt"> & {
  _id: string;
  name: string;
  startDate: string; // Dates as strings to handle HTML input type="date"
  endDate: string;
  location: string;
  thumbnail: File | null; // Can be null if no file is uploaded
  status: "Ongoing" | "Completed"; // Consistent status type
};
const EventTable: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  console.log(selectedEvent);
  const { events, eventsError, eventsLoading } = useEventQueries();
  const [statuses, setStatuses] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [eventFormInputs, setEventFormInputs] =
    useState<EventFormInputs | null>(null);

  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) {
      setStatuses(events.map((event) => event.status));
    }
  }, [events]);

  console.log(statuses);

  if (eventsLoading) {
    return <CircularProgress />;
  }

  if (eventsError) {
    return <div>Error loading events: {eventsError.message}</div>;
  }

  const handleChangeStatus = (id: any, newStatus: any) => {
    console.log(id);
    console.log(newStatus);

    setStatuses((prevStatuses) =>
      prevStatuses.map((status, index) =>
        events[index]._id === id ? newStatus : status
      )
    );
  };

  const handleEditClick = (event: Event) => {
    const formInputs: EventFormInputs = {
      _id: event._id,
      name: event.name,
      startDate: event.startDate, // Assuming it's a string
      endDate: event.endDate, // Assuming it's a string
      location: event.location,
      thumbnail: null, // You can handle file uploads separately
      status: event.status,
    };

    setEventFormInputs(formInputs);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedEvent(null);
  };
  const handleClose = () => {
    setOpen(false); // Close the dialog
  };
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event: Event, index) => (
              <TableRow key={event._id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>
                  {new Date(event.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(event.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={statuses[index] || event.status} // Fallback to event.status
                    onChange={(e) => {
                      const newStatus = e.target.value as
                        | "Ongoing"
                        | "Completed";
                      handleChangeStatus(event._id, newStatus);
                    }}
                  >
                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(event)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleCloseModal}
        maxWidth="md" // Set the maximum width of the modal
        fullWidth // Allow the modal to take the full width of the viewport
      >
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
          {eventFormInputs && (
            <EventForm
              existingEvent={eventFormInputs}
              closeModal={() => setOpen(false)}
            />
          )}{" "}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: 2,
            }}
          >
            <Button onClick={handleClose} color="error" variant="contained">
              Cancel
            </Button>
          </Box>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseModal} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>

      {/* <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {eventFormInputs && <EventForm existingEvent={eventFormInputs} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseModal} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default EventTable;
