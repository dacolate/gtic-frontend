"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Class } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeleteDialog } from "./DeleteDialog";

export function ActionButtons({
  className,
  classData,
}: {
  className?: string;
  classData: Class | undefined;
}) {
  const t = useTranslations("ActionButtons");

  return (
    <div className={`flex space-x-2 ${className}`}>
      {classData ? (
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href={`${classData?.id}/modifyclass`}>
            <Edit className="h-4 w-4" />
            {t("edit")}
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          {t("edit")}
        </Button>
      )}
      <DeleteDialog objectName="classes" id={classData?.id}>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>
      </DeleteDialog>
    </div>
  );
}
