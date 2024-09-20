import React from "react";
import EventForm from "../components/EventForm";
import EventTable from "../components/EventTable";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <EventForm />
      <EventTable />
    </div>
  );
};

export default AdminDashboard;
