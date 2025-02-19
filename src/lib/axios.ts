"use client";

import axios from "axios";

const api = axios.create({
  baseURL:
    // "https://gtic-backend.onrender.com/",
    "http://127.0.0.1:3333/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
