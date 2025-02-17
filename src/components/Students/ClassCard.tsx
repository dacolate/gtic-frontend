import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClassCardProps {
  class: {
    id: number;
    name: string;
    teacher: string;
    students: number;
    startDate: string;
    endDate: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function ClassCard({
  class: cls,
  isSelected,
  onSelect,
}: ClassCardProps) {
  return (
    <Card
      className={`cursor-pointer ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle>{cls.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Teacher: {cls.teacher}</p>
        <p>Students: {cls.students}</p>
        <p>Start Date: {cls.startDate}</p>
        <p>End Date: {cls.endDate}</p>
        <Button className="mt-2" variant={isSelected ? "secondary" : "outline"}>
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardContent>
    </Card>
  );
}
