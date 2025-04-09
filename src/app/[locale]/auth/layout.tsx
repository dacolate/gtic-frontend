"use client";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import TypingLoader from "@/components/TypingLoader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { token, loading, verifyToken } = useAuth();
  console.log("usa", useAuth());
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication check effect
  useEffect(() => {
    const checkAuth = async () => {
      console.log("100");
      if (!loading) {
        console.log("200");
        if (token) {
          // Verify token with backend
          console.log("400");
          const isValid = await verifyToken();
          if (isValid) {
            console.log("500");
            setAuthChecked(true);
            router.push("/");
          } else {
            console.log("600");
            localStorage.removeItem("authToken");
          }
        }
      }
    };

    checkAuth();
  }, [token, loading, router, verifyToken]);

  console.log("800");

  // Show loading state while checking auth
  if (loading) {
    console.log("authChecked", authChecked);
    console.log("loading", loading);
    return (
      <div className="h-screen flex items-center justify-center">
        <TypingLoader />
      </div>
    );
  }

  // Main layout after successful auth
  return <>{children}</>;
}
