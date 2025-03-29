"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Teacher } from "@/lib/types";
import InitialsAvatar from "../InitialsAvatar";
import { capitalizeFullName, formatReadableDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function TeacherInfo({ teacher }: { teacher: Teacher }) {
  const t = useTranslations("StudentInfo");

  return (
    <Card className="h-fit ">
      <CardHeader className="bg-gradient-to-r from-green-500 to-purple-500 text-white">
        <div className="flex items-center space-x-4">
          <InitialsAvatar name={teacher.name} />
          <div>
            <CardTitle className="text-2xl">
              {capitalizeFullName(teacher.name) || "-"}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="font-medium text-gray-500">{t("phone")}</dt>
            <dd>{teacher.phone || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("email")}</dt>
            <dd>{teacher.email || "-"}</dd>
          </div>

          <div>
            <dt className="font-medium text-gray-500">
              {t("firstRegisteredOn")}
            </dt>
            <dd>{formatReadableDate(teacher.createdAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
