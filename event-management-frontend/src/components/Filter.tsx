import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState, FC } from "react";

interface FilterProps {
  filter: string;
  onFilterChange: (newFilter: string) => void;
}

const Filter: FC<FilterProps> = ({ filter, onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(filter);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newFilter = event.target.value;
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <FormControl variant="outlined">
      <InputLabel>Filter</InputLabel>
      <Select value={selectedFilter} onChange={handleChange} label="Filter">
        <MenuItem value="all">All Events</MenuItem>
        <MenuItem value="completed">Completed Events</MenuItem>
        <MenuItem value="ongoing">Ongoing Events</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Filter;
