"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Class {
  id: number;
  name: string;
  course: {
    name: string;
  };
}

interface ClassAssignmentFormProps {
  teacherName: string;
  onSkip: () => void;
}

const mockClasses: Class[] = [
  { id: 1, name: "Math 101", course: { name: "Mathematics" } },
  { id: 2, name: "English Literature", course: { name: "English" } },
  { id: 3, name: "Physics I", course: { name: "Physics" } },
  { id: 4, name: "World History", course: { name: "History" } },
];

export function ClassAssignmentForm({
  teacherName,
  onSkip,
}: ClassAssignmentFormProps) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAssignClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast({
      title: "Class Assigned",
      description: `${teacherName} has been assigned to the selected class.`,
    });
    router.push("/teachers");
  };

  return (
    <form onSubmit={handleAssignClass} className="space-y-4">
      <div>
        <Label htmlFor="class-select">Select a Class</Label>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger id="class-select">
            <SelectValue placeholder="Choose a class" />
          </SelectTrigger>
          <SelectContent>
            {mockClasses.map((cls) => (
              <SelectItem key={cls.id} value={cls.id.toString()}>
                {cls.name} - {cls.course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button type="submit" disabled={!selectedClass || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            "Assign Class"
          )}
        </Button>
      </div>
    </form>
  );
}
