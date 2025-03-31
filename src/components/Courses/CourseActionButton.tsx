"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Trash2, History } from "lucide-react";
import { useTranslations } from "next-intl";
import { CreateCourseDialog } from "./CreateCourseDialog";
import { AdminOnly } from "../adminOnly";

export function CourseActionButton() {
  const t = useTranslations("CourseTable");

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <AdminOnly>
        <CreateCourseDialog />
      </AdminOnly>

      <Button
        asChild
        className="flex items-center gap-2 bg-gray-500 hover:bg-green-600"
      >
        <Link href="/courses/old">
          <History className="h-4 w-4 font-extrabold" />
          {t("Ancient Courses")}
        </Link>
      </Button>
      {/* <Button
        onClick={handleAffectTeacher}
        variant="outline"
        className="flex items-center gap-2"
      >
        <UserPlus className="h-4 w-4" />
        Assign to Class
      </Button> */}
      <Button
        variant="destructive"
        className="flex items-center gap-2 opacity-45"
      >
        <Trash2 className="h-4 w-4" />
        {t("Delete Course")}
      </Button>
    </div>
  );
}
