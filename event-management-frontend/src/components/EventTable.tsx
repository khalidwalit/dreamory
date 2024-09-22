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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import useEventQueries from "../hooks/useEventQueries";
import { Event } from "../types/Event";
import EventForm from "./EventForm";
import Filter from "./Filter";

type EventFormInputs = Omit<Event, "createdAt" | "updatedAt"> & {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  thumbnail: File | null;
  status: "Ongoing" | "Completed";
};

const EventTable: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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
  const [deleteEvent1, setDeleteEvent1] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<keyof Event>("name");
  const [password, setPassword] = useState<string>("");
  const { updateStatus, deleteEvent } = useEventQueries();

  useEffect(() => {
    if (Array.isArray(events) && events.length > 0) {
      setStatuses(events.map((event) => event.status));
    }
  }, [events]);

  const totalPages = 10;

  if (eventsLoading) {
    return <CircularProgress />;
  }

  if (eventsError) {
    return <div>Error loading events: {eventsError.message}</div>;
  }

  if (!events || events.length === 0) {
    return <div>No events found.</div>;
  }

  const handleChangeStatus = (id: string, newStatus: string) => {
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
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate.split("T")[0],
      location: event.location,
      thumbnail: null,
      status: event.status,
    };

    setEventFormInputs(formInputs);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "completed") return event.status === "Completed";
    if (filter === "ongoing") return event.status === "Ongoing";
    return true;
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof Event) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const handleDeleteClick = (name: string, id: string) => {
    setDeleteEvent1({ id, name });
    setOpenDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDialog(false);
  };

  const confirmDelete = () => {
    if (!deleteEvent1) {
      return;
    }
    deleteEvent.mutate({
      id: deleteEvent1.id,
      password: password,
    });
    setOpenDialog(false);
    setPassword("");
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <TableContainer sx={{ paddingTop: "10px !important" }}>
        <Filter filter={filter} onFilterChange={handleFilterChange} />
        <Table>
          <TableHead>
            <TableRow>
              {["name", "startDate", "endDate", "status", "location"].map(
                (column) => (
                  <TableCell key={column}>
                    <TableSortLabel
                      active={sortColumn === column}
                      direction={sortColumn === column ? sortDirection : "asc"}
                      onClick={() => handleSort(column as keyof Event)}
                    >
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </TableSortLabel>
                  </TableCell>
                )
              )}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEvents.map((event) => (
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
                    value={
                      statuses[events.findIndex((e) => e._id === event._id)] ||
                      event.status
                    }
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      handleChangeStatus(event._id, newStatus);

                      updateStatus.mutate({
                        id: event._id,
                        status: newStatus,
                      });
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
                  <IconButton
                    onClick={() => handleDeleteClick(event.name, event._id)}
                  >
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
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </Box>
      </TableContainer>

      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <span>Update Event</span>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "10px !important" }}>
          {eventFormInputs && (
            <EventForm
              existingEvent={eventFormInputs}
              closeModal={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <span>Delete Event</span>
            <IconButton onClick={handleDeleteClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "10px !important" }}>
          <Box
            component="form"
            sx={{
              marginBottom: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: 2,
            }}
          >
            Event Name: {deleteEvent1?.name}
            <TextField
              label="Password"
              type="password"
              value={password || ""}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              required
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={confirmDelete} variant="contained" color="error">
              Confirm Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventTable;
