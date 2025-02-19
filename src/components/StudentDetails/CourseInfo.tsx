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
import { Student } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";

export function CourseInfo({ student }: { student: Student }) {
  const classes = student.classes;
  console.log(classes);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Classes Taken
          <Badge variant="secondary">{classes?.length ?? 0} Courses</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes?.map((classs) => (
              <TableRow key={classs.id}>
                <TableCell className="font-medium">{classs.name}</TableCell>
                <TableCell>{classs.teacher.name}</TableCell>
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
