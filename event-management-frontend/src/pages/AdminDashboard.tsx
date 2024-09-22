import React from "react";
import EventForm from "../components/EventForm";
import EventTable from "../components/EventTable";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <EventForm />
      <EventTable />
    </div>
  );
};

export default AdminDashboard;
