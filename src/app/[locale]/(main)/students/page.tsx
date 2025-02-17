"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios"; // Adjust the import path as needed
import { Course, Student } from "@/lib/types";
import { StudentActionButtons } from "@/components/Students/StudentActionButtons";
// import { StudentGrid } from "@/components/Students/StudentGrid";
import { StudentGridSkeleton } from "@/components/Students/StudentGridSkeleton";
// import { Button } from "@/components/ui/button";
// import { LayoutGrid, List } from "lucide-react";
// import Link from "next/link";
import { StudentTable } from "@/components/Students/StudentTable";
import { AxiosError } from "axios";

export default function TeachersPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // const [viewMode, setViewMode] = useState<string>("card");

  useEffect(() => {
    async function fetchStudents() {
      try {
        // Use the custom axios instance to get the teachers.
        const response = await api.get("/students");
        // If your API returns the data directly or in a nested property,
        // adjust accordingly. For example, if it returns { teachers: [...] }:
        // setTeachers(response.data.teachers);

        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          console.log("Fetch failed:", response);
          return null;
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "An error occurred");
        } else if (err instanceof Error) {
          setError(err.message || "An error occurred");
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    async function fetchCourses() {
      try {
        // Use the custom axios instance to get the teachers.
        const response = await api.get("/courses");
        // If your API returns the data directly or in a nested property,
        // adjust accordingly. For example, if it returns { teachers: [...] }:
        // setTeachers(response.data.teachers);

        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          console.log("Fetch failed:", response);
          return null;
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "An error occurred");
        } else if (err instanceof Error) {
          setError(err.message || "An error occurred");
        } else {
          setError("An error occurred");
        }
      }
    }

    fetchCourses();

    fetchStudents();
  }, []);

  if (loading) {
    return <StudentGridSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Students</h1> */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        {/* <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div> */}
      </div>
      <StudentActionButtons />
      <StudentTable students={students} courses={courses} />
    </div>
  );
}
