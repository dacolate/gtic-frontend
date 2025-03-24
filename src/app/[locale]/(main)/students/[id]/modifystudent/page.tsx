import { ModifyStudentForm } from "@/components/StudentDetails/ModifyStudent";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const studentId = param.id;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Modifier étudiant</h1>
        <Button asChild variant="outline">
          <Link href="/students" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à étudiant
          </Link>
        </Button>
      </div>
      <ModifyStudentForm studentId={studentId} />;
    </div>
  );
}
