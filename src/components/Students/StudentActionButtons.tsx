"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Feather, History } from "lucide-react";
import { useTranslations } from "next-intl";

export function StudentActionButtons() {
  const t = useTranslations("StudentTable");

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button
        asChild
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
      >
        <Link href="/students/new">
          <Feather className="h-4 w-4 font-extrabold" />
          {t("New Student")}
        </Link>
      </Button>
      <Button
        asChild
        className="flex items-center gap-2 bg-gray-500 hover:bg-green-600"
      >
        <Link href="/students/inactive">
          <History className="h-4 w-4 font-extrabold" />
          {t("Ancient Students")}
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
    </div>
  );
}
