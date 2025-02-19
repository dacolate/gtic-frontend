"use client";

import { ActionButtons } from "@/components/StudentDetails/ActionButtons";
import { CourseInfo } from "@/components/StudentDetails/CourseInfo";
// import { ParentInfo } from "@/components/StudentDetails/ParentInfo";
import { PaymentInfo } from "@/components/StudentDetails/PaymentInfo";
import { StudentInfo } from "@/components/StudentDetails/StudentInfo";
import api from "@/lib/axios";
import { Student } from "@/lib/types";
import { AxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export default function StudentDetails({ studentId }: { studentId: string }) {
  const [students, setStudents] = useState<Student>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        // Use the custom axios instance to get the teachers.
        const response = await api.get("/students/" + studentId);
        console.log(response);
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
      }
    }
    fetchStudents();
  }, [studentId]);
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Details</h1>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading courses</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {students && <StudentInfo student={students} />}
          {/* <ParentInfo studentId={studentId} /> */}
        </div>
        <div className="space-y-6">
          {students && <CourseInfo student={students} />}
          {students && <PaymentInfo student={students} />}
        </div>
      </div>
      <ActionButtons studentId={studentId} className="mt-6" />
    </div>
  );
}
