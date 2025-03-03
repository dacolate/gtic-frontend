"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Trash2, Feather, History } from "lucide-react";
import { useTranslations } from "next-intl";

export function PaymentActionButtons() {
  const t = useTranslations("PaymentTable");
  const handleDeleteTeacher = () => {
    // Implement delete teacher functionality
    console.log("Delete teacher");
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
        <Feather className="h-4 w-4 font-extrabold" />
        {t("New Payment")}
      </Button>
      <Button
        asChild
        className="flex items-center gap-2 bg-gray-500 hover:bg-green-600"
      >
        <Link href="/teachers/new">
          <History className="h-4 w-4 font-extrabold" />
          {t("Ancient Payments")}
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
        onClick={handleDeleteTeacher}
        variant="destructive"
        className="flex items-center gap-2 opacity-45"
      >
        <Trash2 className="h-4 w-4" />
        {t("Delete Payment")}
      </Button>
    </div>
  );
}
