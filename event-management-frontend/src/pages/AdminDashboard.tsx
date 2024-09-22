import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
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
  Grid,
} from "@mui/material";
import EventForm from "../components/EventForm";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // State to manage dialog open/close

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };

  const handleClickOpen = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  return (
    <div style={{ padding: "40px" }}>
      <>
        <Container
          sx={{
            margin: "20px auto", // Centers the container and adds space vertically
            padding: "20px", // Adds space around the container
            maxWidth: "80%", // Optional: Set a max width for the container
            borderRadius: "8px", // Optional: Round the corners\
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center", // Aligns items vertically centered
              marginBottom: "20px",
            }}
          >
            <Typography variant="h5" component="h1">
              Admin Dashboard
            </Typography>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}></Box>
            <Button variant="contained" onClick={handleClickOpen}>
              Create New Event
            </Button>
          </Box>
        </Container>
        {/* Dialog for creating a new event */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md" // Set the maximum width of the modal
          fullWidth // Allow the modal to take the full width of the viewport
        >
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

export default AdminDashboard;
