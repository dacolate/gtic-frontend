import { AssignClassForm } from "@/components/StudentDetails/AssignClassForm";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const studentId = param.id;



  return <AssignClassForm studentId={studentId} />;
}
