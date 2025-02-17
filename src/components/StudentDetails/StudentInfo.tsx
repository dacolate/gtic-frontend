import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function StudentInfo({ studentId }: { studentId: string }) {
  console.log(studentId);
  const student = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "698756354",
    dateOfBirth: "2000-01-01",
    address: "New Deido",
    firstRegister: "2024-12-01",
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-purple-500 text-white">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border-4 border-white">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${student.name}`}
            />
            <AvatarFallback>
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <p className="text-blue-100">{student.phone}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium text-gray-500">Date of Birth</dt>
            <dd>{student.dateOfBirth}</dd>
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
            <dd>{student.firstRegister}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
