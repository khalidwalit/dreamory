import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Input } from "@mui/material";

import useEventQueries from "../hooks/useEventQueries"; // Assume this hook contains your mutation

// Define the form input types with File
type EventFormInputs = {
  _id: string;
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

  const { createEvent, updateEvent } = useEventQueries();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todayString = today.toISOString().split("T")[0];
  const tomorrowString = tomorrow.toISOString().split("T")[0];

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
    console.log(existingEvent);
    if (existingEvent) {
      console.log("existing");
      updateEvent.mutate({
        id: existingEvent._id,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        thumbnail: data.thumbnail, // Ensure this is a File or null
        status: data.status, // Optional; can default in the mutation function
      });
      closeModal();
      return;
    }
    createEvent.mutate(data);
    closeModal();
    return;
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
        defaultValue={todayString} // Set default to today
        {...register("startDate", { required: "Start date is required" })}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
        inputProps={{
          min: todayString, // Set min to start date or today
        }}
      />
      <TextField
        type="date"
        label="End Date"
        defaultValue={tomorrowString} // Set default to tomorrow
        {...register("endDate", { required: "End date is required" })}
        error={!!errors.endDate}
        helperText={errors.endDate?.message}
        inputProps={{
          min: todayString, // Set min to start date or today
        }}
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
