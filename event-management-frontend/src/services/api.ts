import axios from 'axios';
console.log(process.env.REACT_APP_API_ENDPOINT); // Log the API endpoint

const API = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT, // backend server URL
});

// Set Authorization token for authenticated requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // if (token) {
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWQzMzI5ODRiZTVlMWUxNmQyNjk1ZSIsImVtYWlsIjoidGVzdDExQGV4YW0ycGxlLmNvbSIsImlhdCI6MTcyNjgyMTE2N30.Ezkn7p6FcNkdT7jFghNNXiCU9H04W8qSARgNPEZVUio`;
  // }
  return config;
});

export default API;
