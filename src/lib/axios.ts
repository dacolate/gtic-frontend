"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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

async function getPayments() {
  const response = await api.get("/payments");

  return response.data;
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"], // Correctly pass the query key as part of an options object
    queryFn: getPayments, // Pass the query function
  });
}

async function getStudents() {
  try {
    const response = await api.get("/students");
    return Array.isArray(response.data) ? response.data : []; // Ensure the response is an array
  } catch (error) {
    console.log("error", error);
  }
}

export function useStudents() {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
  console.log("Query Data:", query.data); // Log the query data
  console.log("Query Status:", query.status); // Log the query status
  console.log("Query Error:", query.error); // Log any errors

  return query;
}
