import axios from 'axios';
console.log(process.env.REACT_APP_API_ENDPOINT); // Log the API endpoint

const API = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT, // backend server URL
});

// Set Authorization token for authenticated requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default API;
