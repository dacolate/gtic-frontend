"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, Edit, RefreshCw, Trash2, Users } from "lucide-react";
import { PaymentPopover } from "../PaymentPopover";
import { Student } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DeleteDialog } from "../classes/DeleteDialog";

export function ActionButtons({
  student,
  className,
}: {
  student: Student | undefined;
  className?: string;
}) {
  const t = useTranslations("ActionButtons");

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {student ? (
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href={`${student?.id}/modifystudent`}>
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

      {student ? (
        <PaymentPopover student={student} />
      ) : (
        <Button variant="outline" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t("addPayment")}
        </Button>
      )}
      <Button
        variant="outline"
        className="flex items-center gap-2"
        disabled={!student}
        asChild
      >
        <Link href={`${student?.id}/assignclass`}>
          <Users className="h-4 w-4" />
          {t("affectToClass")}
        </Link>
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        {t("reinscription")}
      </Button>
      <DeleteDialog objectName="students" id={student?.id}>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>
      </DeleteDialog>
    </div>
  );
}
