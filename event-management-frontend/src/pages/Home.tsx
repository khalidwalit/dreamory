import React, { useState } from "react";
import { Grid, Button, CircularProgress, Box } from "@mui/material";
import useEventQueries from "../hooks/useEventQueries";
import { Event } from "../types/Event";
import Filter from "../components/Filter";
import EventCard from "../components/EventCards";
// import EventCard from "../components/EventCard";

const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 12;
  const {
    data: events,
    error,
    isLoading,
  } = useEventQueries().useFetchEvents(page, limit);
  const [filter, setFilter] = useState<string>("all");
  const [sortColumn, setSortColumn] = useState<keyof Event>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }

  if (!events || events.length === 0) {
    return <div>No events found.</div>;
  }
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "completed") return event.status === "Completed";
    if (filter === "ongoing") return event.status === "Ongoing";
    return true;
  });

  const sortedEvents = filteredEvents.sort((a: any, b: any) => {
    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof Event) => {
    // Toggle sort direction if the same column is clicked
    setSortColumn(column);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div style={{ padding: "40px" }}>
      <Box mb={2}>
        <Button onClick={() => handleSort("name")}>Sort by Name</Button>
        {/* Add more sorting buttons as needed */}
      </Box>
      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Filter filter={filter} onFilterChange={handleFilterChange} />
      </Box>

      <Grid container spacing={4}>
        {sortedEvents.map((event: Event) => (
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

export default Home;
