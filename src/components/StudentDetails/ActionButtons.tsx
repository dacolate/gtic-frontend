"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, Edit, RefreshCw, Users } from "lucide-react";
import { PaymentPopover } from "../PaymentPopover";
import { Student } from "@/lib/types";
import { useTranslations } from "next-intl";

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
      <Button variant="outline" className="flex items-center gap-2">
        <Edit className="h-4 w-4" />
        {t("modify")}
      </Button>
      {student ? (
        <PaymentPopover student={student} />
      ) : (
        <Button variant="outline" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t("addPayment")}
        </Button>
      )}
      <Button variant="outline" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        {t("affectToClass")}
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        {t("reinscription")}
      </Button>
    </div>
  );
}
