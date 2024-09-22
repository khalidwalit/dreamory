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
  TextField,
  TableSortLabel,
  Container,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useEventQueries().useFetchEvents(page, limit);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [eventFormInputs, setEventFormInputs] =
    useState<EventFormInputs | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<keyof Event>("name"); // Default sort by name
  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) {
      setStatuses(events.map((event) => event.status));
    }
  }, [events]);

  if (eventsLoading) {
    return <CircularProgress />;
  }

  if (eventsError) {
    return <div>Error loading events: {eventsError.message}</div>;
  }

  if (!events || events.length === 0) {
    return <div>No events found.</div>;
  }

  const handleChangeStatus = (id: any, newStatus: any) => {
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
  const filteredEvents = events.filter((event) => {
    console.log("apa", filter);
    if (filter === "completed") return event.status === "Completed";
    if (filter === "ongoing") return event.status === "Ongoing";
    return true; // For "all" events
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    const aValue = a[sortColumn] ?? ""; // Fallback to empty string if undefined
    const bValue = b[sortColumn] ?? ""; // Fallback to empty string if undefined

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof Event) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteEventId(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    // if (password === "your_password_here") {
    //   // Replace with actual password validation logic
    //   handleDelete(deleteEventId);
    //   setOpenDialog(false);
    //   setPassword("");
    // } else {
    //   alert("Invalid password!");
    // }
  };
  return (
    <>
      <TableContainer
        sx={{
          margin: "20px auto",
          padding: "20px",
          maxWidth: "80%",
          borderRadius: "8px",
          boxShadow: 2,
        }}
      >
        <FormControl variant="outlined" sx={{ margin: "20px" }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem value="all">All Events</MenuItem>
            <MenuItem value="completed">Completed Events</MenuItem>
            <MenuItem value="ongoing">Ongoing Events</MenuItem>
          </Select>
        </FormControl>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "name"}
                  direction={sortColumn === "name" ? sortDirection : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "startDate"}
                  direction={sortColumn === "startDate" ? sortDirection : "asc"}
                  onClick={() => handleSort("startDate")}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "endDate"}
                  direction={sortColumn === "endDate" ? sortDirection : "asc"}
                  onClick={() => handleSort("endDate")}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "status"}
                  direction={sortColumn === "status" ? sortDirection : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === "location"}
                  direction={sortColumn === "location" ? sortDirection : "asc"}
                  onClick={() => handleSort("location")}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEvents.map((event: Event, index) => (
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
                    value={statuses[index] || event.status}
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
                  <IconButton onClick={() => handleDeleteClick(event._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </Box>
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
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventTable;
