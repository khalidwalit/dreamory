import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

import { TextFieldProps } from "@mui/material/TextField"; // Import the correct type
import { SubmitHandler, useForm } from "react-hook-form";
import useEventQueries from "../hooks/useEventQueries";

interface EventFormData {
  name: string;
  startDate: string; // Dates as strings to handle HTML input type="date"
  endDate: string;
  location: string;
  thumbnail: File | null; // File for the thumbnail
  status: string;
}

interface CreateEventFormProps {
  closeModal: () => void; // Define the type of closeModal
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ closeModal }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>();

  const { createEvent } = useEventQueries();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first file
    if (file) {
      setValue("thumbnail", file); // Set the file as the form value
    }
  };

  const onSubmit: SubmitHandler<EventFormData> = (data) => {
    createEvent.mutate(data);
    closeModal(); // Close the modal after submission
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {/* <Typography variant="h6">Create New Event</Typography> */}

      <TextField
        label="Event Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        type="date"
        label="Start Date"
        {...register("startDate")}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
      />
      <TextField
        type="date"
        label="End Date"
        {...register("endDate")}
        error={!!errors.endDate}
        helperText={errors.endDate?.message}
      />
      <TextField
        label="Location"
        {...register("location")}
        error={!!errors.location}
        helperText={errors.location?.message}
      />

      <Button variant="contained" component="label">
        Upload Event Poster
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange} // Handle file selection
        />
      </Button>

      <Button type="submit" variant="contained" color="primary">
        Create Event
      </Button>
    </Box>
  );
};

export default CreateEventForm;
