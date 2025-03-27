"use client";

import api from "@/lib/axios";
import { Class } from "@/lib/types";
import { AxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { useTranslations } from "next-intl";
import { ActionButtons } from "./ActionButtons";
import { ClassInfo } from "./ClassInfo";
import { StudentsTable } from "./StudentsTable";
import { PricingInfo } from "./PricingInfo";
import { TeacherInfo } from "./TeacherInfo";

export default function ClassDetails({ classId }: { classId: string }) {
  const [classData, setClassData] = useState<Class>();
  const [error, setError] = useState<string>("");
  const t = useTranslations("ClassDetails");

  useEffect(() => {
    async function fetchClass() {
      try {
        const response = await api.get("/classes/" + classId);

        if (response.data.success) {
          setClassData(response.data.data);
        } else {
          console.log("Fetch failed:", response);
          setError(t("fetchFailed"));
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
    fetchClass();
  }, [classId, t]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{t("classDetails")}</h1>
      <ActionButtons className="mb-6" />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("errorLoadingClass")}</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {classData && <ClassInfo classData={classData} />}
          {classData && <TeacherInfo teacher={classData.teacher} />}
        </div>
        <div className="space-y-6">
          {classData && <PricingInfo pricing={classData.pricing} />}
          {classData && <StudentsTable students={classData.students} />}
        </div>
      </div>
    </div>
  );
}
