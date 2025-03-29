import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Teacher } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function CourseInfo({ teacher }: { teacher: Teacher }) {
  const classes = teacher.classes;
  console.log("clases", classes);
  const t = useTranslations("TeacherCourseInfo");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("classesTaught")}
          <Badge variant="secondary">
            {t("coursesCount", { count: classes?.length ?? 0 })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("courseName")}</TableHead>
              <TableHead>{t("gradeName")}</TableHead>
              <TableHead>{t("className")}</TableHead>
              <TableHead>{t("started")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes?.map((classs) => (
              <TableRow key={classs.id}>
                <TableCell className="font-medium">
                  {classs.course?.name}
                </TableCell>
                <TableCell className="font-medium">
                  {classs.grade?.name}
                </TableCell>
                <TableCell className="font-medium">{classs.name}</TableCell>
                <TableCell>
                  <div className="font-bold text-center">
                    {formatReadableDate(classs.startDate)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
