import React, { useState } from "react";
import EventTable from "../components/EventTable";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Container,
  Typography,
} from "@mui/material";
import EventForm from "../components/EventForm";

const Admin: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <>
        <Container
          sx={{
            margin: "20px auto",
            padding: "20px",
            maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "60%" }, // Responsive maxWidth
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{ mb: { xs: 2, sm: 0 } }}
            >
              Admin Dashboard
            </Typography>
            <Button variant="contained" onClick={handleClickOpen}>
              Create New Event
            </Button>
          </Box>
        </Container>
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogContent sx={{ paddingTop: "10px !important" }}>
            <EventForm closeModal={() => setOpen(false)} />
            <Box
              component="form"
              sx={{
                marginBottom: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                paddingTop: 2,
              }}
            >
              <Button onClick={handleClose} color="error" variant="contained">
                Cancel
              </Button>
            </Box>
          </DialogContent>
          <DialogActions> </DialogActions>
        </Dialog>

        <EventTable />
      </>
    </div>
  );
};

export default Admin;
