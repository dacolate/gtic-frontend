"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function ActionButtons({ className }: { className?: string }) {
  const t = useTranslations("ActionButtons");

  return (
    <div className={`flex space-x-2 ${className}`}>
      <Button variant="outline">
        <Edit className="mr-2 h-4 w-4" />
        {t("edit")}
      </Button>
      <Button variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        {t("addStudent")}
      </Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        {t("delete")}
      </Button>
    </div>
  );
}
