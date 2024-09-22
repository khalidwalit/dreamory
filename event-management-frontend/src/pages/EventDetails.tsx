import React from "react";
import { useParams } from "react-router-dom";
import {
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import useEventQueries from "../hooks/useEventQueries"; // Import your custom hook

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the event ID from the URL
  const { useGetEvent } = useEventQueries(); // Destructure useGetEvent from the hook
  const { data: event, error, isLoading } = useGetEvent(id as string); // Cast id to string

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading event details: {error.message}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  const imageUrl = `${process.env.REACT_APP_API_ENDPOINT}/${event.thumbnail}`;

  return (
    <div style={{ padding: "40px" }}>
      <Card
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          margin: "auto",
          padding: "20px",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: {
              xs: 300, // Height for extra-small screens
              sm: 400, // Height for small screens
              md: 500, // Height for medium and larger screens
            },
          }}
          image={imageUrl}
          alt={event.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {event.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Status: {event.status}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Location: {event.location}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
          ></Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
