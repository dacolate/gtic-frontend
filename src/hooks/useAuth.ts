"use client";

import api from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { useState, useEffect, useCallback } from "react";

export type UserInfo = {
  id: number;
  name: string;
  role: string;
  email: string;
  created_at: string;
};

const baseURL = "https://gtic-backend.onrender.com/";
// "http://127.0.0.1:3333/";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }

    setLoading(false);
  }, []);
  interface LoginResponse {
    success: boolean;
    message?: string;
  }
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      console.log(`${process.env.API_BASE_URL}`);
      const response = await axios.post(
        baseURL + "auth/login",
        // "http://127.0.0.1:3333/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const { token, ...userInfo } = response.data.data;
        localStorage.setItem("authToken", token);

        setToken(token);
        setUserInfo(userInfo);
        console.log("uss", userInfo);
        console.log("usd", response.data.data);
        return { success: true, message: "Login successful" };
      } else {
        console.log("Login failed:", response);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.log("Login error:", error);
      if (error instanceof AxiosError && error.response?.data.message) {
        return { success: false, message: error.response?.data.message };
      }
      return { success: false, message: "Unknown error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");

    setToken(null);
  };

  const verifyToken = useCallback(async (): Promise<boolean> => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) return false;

    try {
      const response = await api.get("auth/verify");

      if (response.data.valid) {
        // Add this: Fetch user info after token verification
        const userResponse = await api.get("auth/me"); // Assuming an endpoint like this exists
        setUserInfo(userResponse.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }, []);

  return { token, login, verifyToken, loading, logout, userInfo };
}
