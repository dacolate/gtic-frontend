import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Clear the token by calling the logout API
        await axios.delete("/api/logout");
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
