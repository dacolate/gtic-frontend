import TeacherDetails from "@/components/Teachers/TeacherDetails";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const teacherId = param.id;

  return <TeacherDetails teacherId={teacherId} />;
}
