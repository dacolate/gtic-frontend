"use client";

import { ActionButtons } from "@/components/StudentDetails/ActionButtons";
import { CourseInfo } from "@/components/StudentDetails/CourseInfo";
import { PaymentInfo } from "@/components/StudentDetails/PaymentInfo";
import { StudentInfo } from "@/components/StudentDetails/StudentInfo";
import api from "@/lib/axios";
import { Student } from "@/lib/types";
import { AxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { ParentInfo } from "./ParentInfo";
import { useTranslations } from "next-intl";

export default function StudentDetails({ studentId }: { studentId: string }) {
  const [student, setStudent] = useState<Student>();
  const [error, setError] = useState<string>("");
  const t = useTranslations("StudentDetails");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await api.get("/students/" + studentId);
        console.log(response);

        if (response.data.success) {
          setStudent(response.data.data);
        } else {
          console.log("Fetch failed:", response);
          return null;
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || t("errorOccurred"));
        } else if (err instanceof Error) {
          setError(err.message || t("errorOccurred"));
        } else {
          setError(t("errorOccurred"));
        }
      }
    }
    fetchStudents();
  }, [studentId, t]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{t("studentDetails")}</h1>
      <ActionButtons student={student} className="mb-6" />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("errorLoadingCourses")}</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {student && <StudentInfo student={student} />}
          {student && <ParentInfo student={student} />}
        </div>
        <div className="space-y-6">
          {student && <CourseInfo student={student} />}
          {student && <PaymentInfo student={student} />}
        </div>
      </div>
    </div>
  );
}
