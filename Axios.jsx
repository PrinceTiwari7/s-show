// src/utils/Axios.jsx
//
// All TMDB calls now go through our Express backend (/api/...).
// The backend holds the secret TMDB bearer token – it never reaches the browser.

import axios from "axios";

const api = axios.create({
  // In development Vite proxies /api → http://localhost:5000
  // In production change this to your deployed API URL
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
