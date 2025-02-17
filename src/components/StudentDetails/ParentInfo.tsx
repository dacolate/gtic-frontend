import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ParentInfo({ studentId }: { studentId: string }) {
  const parent = {
    name: "Jane Doe",
    relation: "Mother",
    phone: "+1 (555) 123-4567",
    email: "jane.doe@example.com",
    address: "123 Main St, Anytown, USA",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${parent.name}`}
            />
            <AvatarFallback>
              {parent.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl">{parent.name}</p>
            <p className="text-sm text-gray-500">{parent.relation}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-500">Phone</dt>
            <dd>{parent.phone}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Email</dt>
            <dd>{parent.email}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-gray-500">Address</dt>
            <dd>{parent.address}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
