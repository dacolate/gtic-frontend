"use client";

import { Button } from "@/components/ui/button";
// import { Edit, Users } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Teacher } from "@/lib/types";
import { useTranslations } from "next-intl";
// import { Link } from "@/i18n/routing";
import { DeleteDialog } from "../classes/DeleteDialog";

export function ActionButtons({
  teacher,
  className,
}: {
  teacher: Teacher | undefined;
  className?: string;
}) {
  const t = useTranslations("ActionButtons");

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* {teacher ? (
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href={`${teacher?.id}/modifyteacher`}>
            <Edit className="h-4 w-4" />
            {t("modify")}
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          {t("modify")}
        </Button>
      )}

      <Button
        variant="outline"
        className="flex items-center gap-2"
        disabled={!teacher || true}
        asChild
      >
        <Link href={`${teacher?.id}/affectToClass`}>
          <Users className="h-4 w-4" />
          {t("affectToClass")}
        </Link>
      </Button> */}
      <DeleteDialog objectName="teachers" id={teacher?.id}>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>
      </DeleteDialog>
    </div>
  );
}
