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

export function CourseInfo({ studentId }: { studentId: string }) {
  const courses = [
    {
      id: 1,
      name: "Mathematics",
      duration: "From January 2024 to February 2024",
      attendance: "80%",
    },
    {
      id: 2,
      name: "Science",
      duration: "From February 2024 to March 2024",
      attendance: "80%",
    },
    {
      id: 3,
      name: "English",
      duration: "From March 2024 to May 2024",
      attendance: "80%",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Courses Taken
          <Badge variant="secondary">{courses.length} Courses</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>
                  <div className="font-bold text-center">
                    {course.attendance}
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
