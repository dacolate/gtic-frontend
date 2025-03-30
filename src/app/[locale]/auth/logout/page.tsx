"use client";

import { useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "@/i18n/routing";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Clear the token by calling the logout API
        await api.delete("/auth/logout");
        router.push("/auth/login"); // Redirect to login page
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default LogoutPage;
