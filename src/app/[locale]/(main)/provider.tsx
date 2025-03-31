"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import { UserInfo } from "@/hooks/useAuth";

// Create the context
const UserInfoContext = createContext<UserInfo | null>(null);

// Create a hook for easy access to the context
export function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (context === null) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
}

export default function Providers({
  children,
  userInfo,
}: {
  children: React.ReactNode;
  userInfo: UserInfo | undefined;
}) {
  const [queryClient] = useState(() => new QueryClient());

  if (!userInfo) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <UserInfoContext.Provider value={userInfo}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </UserInfoContext.Provider>
  );
}
