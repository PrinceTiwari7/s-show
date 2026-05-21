import axios from "axios";

// All requests go to our Express backend at /api
// Vite proxies /api → http://localhost:5000 in development
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
