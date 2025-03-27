"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Teacher } from "@/lib/types";
import InitialsAvatar from "../InitialsAvatar";
import { useTranslations } from "next-intl";

export function TeacherInfo({ teacher }: { teacher: Teacher }) {
  const t = useTranslations("TeacherInfo");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <InitialsAvatar name={teacher.name} />
          <div>
            <CardTitle>{teacher.name}</CardTitle>
            <p className="text-sm text-gray-500">{t("instructor")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium text-gray-500">{t("email")}</dt>
            <dd>{teacher.email || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("phone")}</dt>
            <dd>{teacher.phone || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("status")}</dt>
            <dd>{teacher.active ? t("active") : t("inactive")}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
