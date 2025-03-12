"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/lib/types";
import InitialsAvatar from "../InitialsAvatar";
import { capitalizeFullName, formatReadableDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function StudentInfo({ student }: { student: Student }) {
  const t = useTranslations("StudentInfo");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-purple-500 text-white">
        <div className="flex items-center space-x-4">
          <InitialsAvatar name={student.name + " " + student.firstname} />
          <div>
            <CardTitle className="text-2xl">
              {capitalizeFullName(student.name + " " + student.firstname) ||
                "-"}
            </CardTitle>
            <p className="text-blue-100">
              {student.gender === "M" ? t("male") : t("female")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium text-gray-500">{t("dateOfBirth")}</dt>
            <dd>{formatReadableDate(student.birthday || "-")}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("phone")}</dt>
            <dd>{student.phone || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("email")}</dt>
            <dd>{student.email || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("address")}</dt>
            <dd>{student.address || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">
              {t("firstRegisteredOn")}
            </dt>
            <dd>{formatReadableDate(student.createdAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
