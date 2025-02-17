"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { Card } from "@/components/ui/card";

import StatCard from "./StatCard";

export default function Dashboard() {
  // const { userInfo } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({
    totalStudents: 0,
    coursesOffered: 0,
    classesToday: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats from API
    // This is a mock implementation
    setStats({
      totalStudents: 1000,
      coursesOffered: 8,
      classesToday: 3,
    });
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* <h3 className="text-gray-700 text-3xl font-medium">
        Welcome back, {userInfo?.name}!
      </h3> */}

      <div>
        <div className="flex flex-wrap -mx-6">
          {/* <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
            <Card className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
              <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                <Users className="h-8 w-8 text-white" />
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">
                  {stats.totalStudents}
                </h4>
                <div className="text-gray-500">Students Enrolled</div>
              </div>
            </Card>
          </div> */}
          <StatCard type="student" />

          {/* <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
            <Card className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
              <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                <BookOpen className="h-8 w-8 text-white" />
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">
                  {stats.coursesOffered}
                </h4>
                <div className="text-gray-500">Courses Offered</div>
              </div>
            </Card>
          </div> */}
          <StatCard type="teacher" />

          {/* <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
            <Card className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
              <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                <BarChart className="h-8 w-8 text-white" />
              </div>

              <div className="mx-5">
                <h4 className="text-2xl font-semibold text-gray-700">
                  {stats.classesToday}
                </h4>
                <div className="text-gray-500">Classes Today</div>
              </div>
            </Card>
          </div> */}
          <StatCard type="class" />
          <StatCard type="payment" />
        </div>
      </div>

      {/* You can add a chart component here for enrollment trends */}
    </div>
  );
}
