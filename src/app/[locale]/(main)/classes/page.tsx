"use client";

import { ClassTable } from "@/components/classes/ClassTable";
import { PaymentActionButtons } from "@/components/Payments/PaymentActionButton";
import api from "@/lib/axios";
import { Class } from "@/lib/types";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

export default function PaymentsPage() {
  const t = useTranslations("PaymentTable");
  const [classes, setClasses] = useState<Class[]>([]); // State to store the fetched classes
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    // Function to fetch classes
    const fetchClasses = async () => {
      try {
        setIsLoading(true); // Set loading to true before making the request
        const response = await api.get("/classes"); // Replace with your API endpoint
        if (response.data.success) {
          setClasses(response.data.data); // Set the fetched classes
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

    fetchClasses(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return <div>Loading classes...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error state
  }

  console.log(classes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4"
    >
      {/* <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Students</h1> */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("Payments")}</h1>
      </div>
      <PaymentActionButtons />

      <ClassTable classes={classes} />
    </motion.div>
  );
}
