"use client";

// import { ActionButtons } from "@/components/StudentDetails/ActionButtons";
import api from "@/lib/axios";
import { Teacher } from "@/lib/types";
import { AxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { useTranslations } from "next-intl";
import { TeacherInfo } from "./TeacherInfo";
import { CourseInfo } from "./CourseInfo";
import { ActionButtons } from "./TeacherDetailsActionButtons";

export default function TeacherDetails({ teacherId }: { teacherId: string }) {
  const [teacher, setTeacher] = useState<Teacher>();
  const [error, setError] = useState<string>("");
  const t = useTranslations("TeacherDetails");

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await api.get("/teachers/" + teacherId);
        console.log(response);

        if (response.data.success) {
          setTeacher(response.data.data);
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
    fetchTeachers();
  }, [teacherId, t]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{t("teacherDetails")}</h1>
      <ActionButtons teacher={teacher} className="mb-6" />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("errorLoadingCourses")}</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="w-full flex space-x-3">
        {teacher && <TeacherInfo teacher={teacher} />}
        {teacher && <CourseInfo teacher={teacher} />}
        {/*{student && <PaymentInfo student={student} />} */}
      </div>
    </div>
  );
}
