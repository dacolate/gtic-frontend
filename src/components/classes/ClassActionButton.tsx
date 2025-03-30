"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Feather, History } from "lucide-react";
import { useTranslations } from "next-intl";

export function ClassActionButton() {
  const t = useTranslations("ClassTable");

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button
        asChild
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
      >
        <Link href="/classes/new">
          <Feather className="h-4 w-4 font-extrabold" />

          {t("New Class")}
        </Link>
      </Button>
      <Button
        asChild
        className="flex items-center gap-2 bg-gray-500 hover:bg-green-600"
      >
        <Link href="/classes/inactive">
          <History className="h-4 w-4 font-extrabold" />
          {t("Ancient Classes")}
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
