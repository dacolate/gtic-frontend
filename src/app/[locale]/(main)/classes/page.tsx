import { NewStudForm } from "@/components/Students/NewStud";

export default function NewStudentPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Student</h1>
      <NewStudForm />
    </div>
  );
}
