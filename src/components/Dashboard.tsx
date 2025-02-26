"use client";

// import { useAuth } from "@/hooks/useAuth";
// import { Card } from "@/components/ui/card";

import StatCard from "./StatCard";

export default function Dashboard() {
  // const { userInfo } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* <h3 className="text-gray-700 text-3xl font-medium">
        Welcome back, {userInfo?.name}!
      </h3> */}

      <div>
        <div className="flex flex-wrap -mx-6">
          <StatCard type="student" />

          <StatCard type="teacher" />
          <StatCard type="class" />
          <StatCard type="payment" />
        </div>
      </div>

      {/* You can add a chart component here for enrollment trends */}
    </div>
  );
}
