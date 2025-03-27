"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Class } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";

export function ClassInfo({ classData }: { classData: Class }) {
  const t = useTranslations("ClassInfo");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <CardTitle className="text-2xl">
          {classData.name}
          <Badge variant="secondary" className="ml-2">
            {classData.active ? t("active") : t("inactive")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium text-gray-500">{t("course")}</dt>
            <dd>{classData.grade?.course?.name || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("grade")}</dt>
            <dd>{classData.grade?.name || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("startDate")}</dt>
            <dd>{formatReadableDate(classData.startDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("duration")}</dt>
            <dd>
              {classData.expectedDuration} {t("days")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("createdAt")}</dt>
            <dd>{formatReadableDate(classData.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("description")}</dt>
            <dd>{classData.description || "-"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
