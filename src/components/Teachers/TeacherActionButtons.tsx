"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Feather } from "lucide-react";
import { useTranslations } from "next-intl";

export function TeacherActionButtons() {
  const t = useTranslations("TeacherTable");

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button
        asChild
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
      >
        <Link href="/teachers/new">
          <Feather className="h-4 w-4 font-extrabold" />
          {t("New Teacher")}
        </Link>
      </Button>
    </div>
  );
}
