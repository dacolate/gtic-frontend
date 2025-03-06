import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/lib/types";
import InitialsAvatar from "../InitialsAvatar";
import { formatReadableDate } from "@/lib/utils";

export function StudentInfo({ student }: { student: Student }) {
  console.log(student);
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-purple-500 text-white">
        <div className="flex items-center space-x-4">
          <InitialsAvatar name={student.name} />
          <div>
            <CardTitle className="text-2xl">
              {student.name + student.firstname}
            </CardTitle>
            <p className="text-blue-100">{student.phone}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium text-gray-500">Date of Birth</dt>
            <dd>{formatReadableDate(student.birthday)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Email</dt>
            <dd>{student.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Address</dt>
            <dd>{student.address}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">First registered on</dt>
            <dd>{formatReadableDate(student.createdAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
