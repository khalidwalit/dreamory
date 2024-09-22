import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
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
  console.log(event._id);
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
  const { events, eventsError, eventsLoading } = useEventQueries();

  if (eventsLoading) {
    return <CircularProgress />;
  }

  if (eventsError) {
    return <div>Error loading events: {eventsError.message}</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <Grid container spacing={4}>
        {events.map((event: Event, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EventGrid;
