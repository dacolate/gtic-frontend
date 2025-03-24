"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { CreateClassForm } from "@/components/classes/NewClasss";

export default function NewTeacherPage() {
  const t = useTranslations("NewStud");

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("add new Student")}
        </h1>
        <Button asChild variant="outline">
          <Link href="/classes" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToStudents")}
          </Link>
        </Button>
      </div>
      <CreateClassForm />
    </div>
  );
}
