"use client";

import { CourseActionButton } from "@/components/Courses/CourseActionButton";
import { CourseTable } from "@/components/Courses/CourseTable";
import api from "@/lib/axios";
import { Course } from "@/lib/types";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
// import { CourseTable } from "@/components/Courses/CourseTable";

export default function ClassesPage() {
  const t = useTranslations("ClassTable");
  const [courses, setCourses] = useState<Course[]>([]); // State to store the fetched classes
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    // Function to fetch classes
    const fetchCourses = async () => {
      try {
        setIsLoading(true); // Set loading to true before making the request
        const response = await api.get("/courses"); // Replace with your API endpoint
        if (response.data.success) {
          setCourses(response.data.data); // Set the fetched classes
        } else {
          setError(response.data.message); // Handle API error message
        }
      } catch (error) {
        console.log("error", error);
        setError("An error occurred while fetching classes."); // Handle network or other errors
      } finally {
        setIsLoading(false); // Set loading to false after the request is complete
      }
    };

    fetchCourses(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return <div>Loading courses...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error state
  }

  console.log(courses);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4"
    >
      {/* <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Students</h1> */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("Courses")}</h1>
      </div>
      <CourseActionButton />

      {/* <CourseTable courses={courses} /> */}
      <CourseTable
        courses={courses}
        // onAddGrade={(courseId) => {
        //   // Handle adding a new grade to the specified course
        //   console.log("Add grade to course:", courseId);
        //   // You would typically open a modal or navigate to a grade creation page here
        // }}
      />
    </motion.div>
  );
}
