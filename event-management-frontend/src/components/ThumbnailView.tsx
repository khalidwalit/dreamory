import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import useEventQueries from "../hooks/useEventQueries";
import { useNavigate } from "react-router-dom"; // Update to useNavigate
import { Event } from "../types/Event"; // Import the Event interface from your types

// EventCard component with props typed
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const imageUrl = `${process.env.REACT_APP_API_ENDPOINT}/${event.thumbnail}`;
  const handleViewEvent = () => {
    navigate(`/${event._id}`); // Navigate to event details page
  };
  return (
    <Card style={{ height: "100%" }}>
      <CardMedia
        component="img"
        height="120"
        image={imageUrl}
        alt={event.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.location}
        </Typography>
      </CardContent>
      <Button size="small" color="primary" onClick={handleViewEvent}>
        View Event
      </Button>
    </Card>
  );
};

// Main component to render the grid of event cards
const EventGrid: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
  const {
    data: events,
    error,
    isLoading,
  } = useEventQueries().useFetchEvents(page, limit);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }

  if (!events || events.length === 0) {
    return <div>No events found.</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <Grid container spacing={4}>
        {events.map((event: Event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="space-between" marginTop="20px">
        <Button
          variant="contained"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <Button variant="contained" onClick={() => setPage((prev) => prev + 1)}>
          Next
        </Button>
      </Box>
    </div>
  );
};

export default EventGrid;
