// src/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  console.log(user);
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // Render the protected component if authenticated
};

export default ProtectedRoute;
