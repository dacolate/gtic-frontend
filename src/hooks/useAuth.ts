"use client";

import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

interface UserInfo {
  name: string;
  role: string;
  email: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
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
        "https://gtic-backend.onrender.com/auth/login",
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
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setToken(token);
        setUserInfo(userInfo);
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

    localStorage.removeItem("userInfo");
    setToken(null);
  };

  return { token, login, logout, userInfo };
}
