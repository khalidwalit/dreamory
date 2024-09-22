import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EventDetails from "./pages/EventDetails";
import CourseGrid from "./components/CourseGrid";
import Login from "./pages/Login";
import { AuthProvider } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<CourseGrid />} />
            <Route path="/:id" element={<EventDetails />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
