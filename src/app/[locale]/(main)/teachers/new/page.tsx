import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NewTeacherForm } from "@/components/Teachers/NewTeacherForm";
import { Link } from "@/i18n/routing";

export default function NewTeacherPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Nouvel Enseignant</h1>
        <Button asChild variant="outline">
          <Link href="/teachers" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux enseignants
          </Link>
        </Button>
      </div>
      <NewTeacherForm />
    </div>
  );
}
