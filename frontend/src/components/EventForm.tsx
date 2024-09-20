import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useEventQueries from "../hooks/useEventQueries";
import { TextField, Button } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type EventFormInputs = {
  name: string;
  startDate: Date;
  endDate: Date;
  location: string;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  location: yup.string().required(),
});

const EventForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormInputs>({
    resolver: yupResolver(schema),
  });
  const { createEvent } = useEventQueries();

  const onSubmit: SubmitHandler<EventFormInputs> = (data) => {
    createEvent.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      />
      <TextField
        type="date"
        label="End Date"
        {...register("endDate")}
        error={!!errors.endDate}
      />
      <TextField
        label="Location"
        {...register("location")}
        error={!!errors.location}
        helperText={errors.location?.message}
      />
      <Button type="submit">Create Event</Button>
    </form>
  );
};

export default EventForm;
