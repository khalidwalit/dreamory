import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EventDetails from "./pages/EventDetails";
import CourseGrid from "./components/CourseGrid";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<CourseGrid />} />
          {/* Add other routes for user portal, login, etc. */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
