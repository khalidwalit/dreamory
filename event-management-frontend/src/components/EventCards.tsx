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
import { useNavigate } from "react-router-dom";
import { Event } from "../types/Event";
import Filter from "./Filter";

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate();
  const imageUrl = `${process.env.REACT_APP_API_ENDPOINT}/${event.thumbnail}`;
  const handleViewEvent = () => {
    navigate(`/${event._id}`);
  };

  return (
    <Card
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
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
            md: 200, // Height for medium and larger screens
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
        <Button variant="contained" color="primary" onClick={handleViewEvent}>
          View Event
        </Button>
      </CardContent>
    </Card>
  );
};
export default EventCard;
