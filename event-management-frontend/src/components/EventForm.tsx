import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Input } from "@mui/material";

import useEventQueries from "../hooks/useEventQueries"; // Assume this hook contains your mutation

// Define the form input types with File
type EventFormInputs = {
  name: string;
  startDate: string; // Dates as strings to handle HTML input type="date"
  endDate: string;
  location: string;
  thumbnail: File | null; // Can be null if no file is uploaded
  status: "Ongoing" | "Completed"; // Consistent status type
};

interface EventFormProps {
  existingEvent?: EventFormInputs; // Accept an existing event for updates
  closeModal: () => void; // Define the type of closeModal
}
const EventForm: React.FC<EventFormProps> = ({ existingEvent, closeModal }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventFormInputs>({
    defaultValues: existingEvent, // Set default values if updating
  });

  const { createEvent } = useEventQueries();

  useEffect(() => {
    if (existingEvent) {
      reset(existingEvent);
    }
  }, [existingEvent, reset]);

  // Handle file input changes and set the file in the form
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first file
    if (file) {
      setValue("thumbnail", file); // Set the file as the form value
    }
  };

  const onSubmit: SubmitHandler<EventFormInputs> = (data) => {
    createEvent.mutate(data);
    closeModal();
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
        {/* Upload Event Poster */}
        <Input
          type="file"
          // accept="image/*"
          onChange={handleFileChange} // Handle file selection
        />
      </Button>

      <Button type="submit" variant="contained" color="primary">
        {existingEvent ? "Update Event" : "Create Event"}
      </Button>
    </Box>
  );
};
export default EventForm;
