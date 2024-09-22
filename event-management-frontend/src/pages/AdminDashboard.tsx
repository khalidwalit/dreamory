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
    <div>
      <h1>Admin Dashboard</h1>
      <Button variant="contained" onClick={handleClickOpen}>
        Create New Event
      </Button>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>

      {/* Dialog for creating a new event */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md" // Set the maximum width of the modal
        fullWidth // Allow the modal to take the full width of the viewport
      >
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <EventForm closeModal={() => setOpen(false)} />
          <Box
            component="form"
            sx={{
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
    </div>
  );
};

export default AdminDashboard;
