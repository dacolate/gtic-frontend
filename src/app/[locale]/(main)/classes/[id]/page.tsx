import ClassDetails from "@/components/classes/ClassDetails";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const classId = param.id;

  return <ClassDetails classId={classId} />;
}
