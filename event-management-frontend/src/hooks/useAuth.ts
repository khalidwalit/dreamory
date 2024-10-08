import { useMutation } from '@tanstack/react-query';
import API from '../services/api'; // Adjust the import based on your project structure
import { useNavigate } from 'react-router-dom'; // Import navigate

// Define types for login and registration
type LoginCredentials = { email: string; password: string };
type RegisterCredentials = { email: string; password: string };

// Hook for authentication
const useAuth = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Simple check for token existence
  const navigate = useNavigate(); // Get navigate function

  // Mutation for logging in
  const login = useMutation<any, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await API.post('/auth/login', credentials);
      return response.data; // Return the user data or token as needed
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token.token); // Store the token in local storage
      // Optionally, you can store the user ID as well
      localStorage.setItem('userId', data.token.userId);
      // Handle successful login (e.g., store token, user info)
      // You might also want to invalidate any queries related to user state here
      window.location.href = "/admin";

    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Handle error (e.g., show an error message)
    },
  });

  // Mutation for registering a new user
  const register = useMutation<any, Error, RegisterCredentials>({
    mutationFn: async (userData: RegisterCredentials) => {
      const response = await API.post('/auth/register', userData);
      return response.data; // Return the user data or confirmation message
    },
    onSuccess: (data) => {
      // Handle successful registration (e.g., redirect to login)
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      // Handle error (e.g., show an error message)
    },
  });

  const logout = useMutation<any, Error>({
    mutationFn: async () => {
      const response = await API.post('/auth/logout');
      return response.data; // Return the confirmation message
    },
    onSuccess: () => {
      localStorage.removeItem('token'); // Remove the token on successful logout
      localStorage.removeItem('userId'); // Optionally remove user ID
      navigate("/login"); // Redirect to login page
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Handle error (e.g., show an error message)
    },
  });

  return { isAuthenticated,login, register, logout };
};

export default useAuth;
