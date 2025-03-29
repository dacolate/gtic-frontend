"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios"; // Adjust the import path as needed
import { TeacherActionButtons } from "@/components/Teachers/TeacherActionButtons";
import { Course, Teacher } from "@/lib/types";
// import { TeacherGrid } from "@/components/Teachers/TeacherGrid";
import { AxiosError } from "axios";
import TypingLoader from "@/components/TypingLoader";
import { TeacherTable } from "@/components/Teachers/TeacherTable";
import { useTranslations } from "next-intl";

export interface TeachersResponse {
  success: boolean;
  data: Teacher[];
  message: string;
}

export default function TeachersPage() {
  const t = useTranslations("TeacherTable");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await api.get("/teachers");
        if (response.data.success) {
          setTeachers(response.data.data);
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

    fetchTeachers();
  }, []);

  if (loading) {
    return <TypingLoader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        {t("Our Teachers")}
      </h1>
      <TeacherActionButtons />
      {/* <TeacherGrid data={teachers} /> */}
      <TeacherTable courses={courses} teachers={teachers} />
    </div>
  );
}
