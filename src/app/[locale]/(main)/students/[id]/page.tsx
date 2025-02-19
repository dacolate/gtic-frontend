import StudentDetails from "@/components/StudentDetails/StudentDetails";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const studentId = param.id;

  return <StudentDetails studentId={studentId} />;
}
