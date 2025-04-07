"use client";
import Menu from "@/components/Menu";
import Navbar from "@/components/NavBar";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import Providers from "./provider";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import TypingLoader from "@/components/TypingLoader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { token, loading, verifyToken, userInfo } = useAuth();
  console.log("usa", useAuth());
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication check effect
  useEffect(() => {
    const checkAuth = async () => {
      console.log("100");
      if (!loading) {
        console.log("200");
        if (!token) {
          console.log("300");
          router.push("/auth/login");
        } else {
          // Verify token with backend
          console.log("400");
          const isValid = await verifyToken();
          if (!isValid) {
            console.log("500");
            router.push("/auth/login");
          } else {
            console.log("600");
            setAuthChecked(true);
          }
          console.log("700");
        }
      }
    };

    checkAuth();
  }, [token, loading, router, verifyToken]);

  console.log("800");

  // Show loading state while checking auth
  if (loading || !authChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <TypingLoader />
      </div>
    );
  }

  // Main layout after successful auth
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] text-center bg-white border-r">
        <Link href="/" className="flex items-center justify-center gap-2 py-4">
          <Image
            src="/gticHorizontal.png"
            alt="GTIC"
            width={128}
            height={128}
            priority
          />
        </Link>
        <Menu />
      </div>

      {/* Main Content Area */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-auto flex flex-col">
        {authChecked && <Navbar userInfo={userInfo} />}
        <Providers userInfo={userInfo}>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </Providers>
      </div>
    </div>
  );
}
