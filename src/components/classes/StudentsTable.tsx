"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student } from "@/lib/types";
import { useTranslations } from "next-intl";
import InitialsAvatar from "../InitialsAvatar";

export function StudentsTable({ students }: { students: Student[] }) {
  const t = useTranslations("StudentsTable");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("enrolledStudents")}
          <span className="text-sm font-normal">
            {t("count", { count: students.length })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("student")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("phone")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <InitialsAvatar
                        name={`${student.name} ${student.firstname}`}
                      />
                      <span>
                        {student.name} {student.firstname}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email || "-"}</TableCell>
                  <TableCell>{student.phone || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-4">{t("noStudents")}</p>
        )}
      </CardContent>
    </Card>
  );
}
