import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { NewStud } from "@/components/Students/NewStud";

export default function NewTeacherPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Add New Student</h1>
        <Button asChild variant="outline">
          <Link href="/students" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Link>
        </Button>
      </div>
      <NewStud />
    </div>
  );
}
