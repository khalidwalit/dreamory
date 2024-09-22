import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Input } from "@mui/material";

import useEventQueries from "../hooks/useEventQueries";

type EventFormInputs = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  thumbnail: File | null;
  status: "Ongoing" | "Completed";
};

interface EventFormProps {
  existingEvent?: EventFormInputs;
  closeModal: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ existingEvent, closeModal }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventFormInputs>({
    defaultValues: existingEvent,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);
    }
  };

  const onSubmit: SubmitHandler<EventFormInputs> = (data) => {
    if (existingEvent) {
      updateEvent.mutate({
        id: existingEvent._id,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        thumbnail: data.thumbnail,
        status: data.status,
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
      <TextField
        label="Event Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        type="date"
        label="Start Date"
        defaultValue={todayString}
        {...register("startDate", { required: "Start date is required" })}
        error={!!errors.startDate}
        helperText={errors.startDate?.message}
        inputProps={{
          min: todayString,
        }}
      />
      <TextField
        type="date"
        label="End Date"
        defaultValue={tomorrowString}
        {...register("endDate", { required: "End date is required" })}
        error={!!errors.endDate}
        helperText={errors.endDate?.message}
        inputProps={{
          min: todayString,
        }}
      />
      <TextField
        label="Location"
        {...register("location")}
        error={!!errors.location}
        helperText={errors.location?.message}
      />

      <Button variant="contained" component="label">
        <Input type="file" onChange={handleFileChange} />
      </Button>

      <Button type="submit" variant="contained" color="primary">
        {existingEvent ? "Update Event" : "Create Event"}
      </Button>
    </Box>
  );
};

export default EventForm;
