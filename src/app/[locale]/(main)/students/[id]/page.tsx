import { ActionButtons } from "@/components/StudentDetails/ActionButtons";
import { CourseInfo } from "@/components/StudentDetails/CourseInfo";
import { ParentInfo } from "@/components/StudentDetails/ParentInfo";
import { PaymentInfo } from "@/components/StudentDetails/PaymentInfo";
import { StudentInfo } from "@/components/StudentDetails/StudentInfo";

export default function StudentDetailsPage() {
  //   {
  //   params,
  // }: {
  //   params: { id: string };
  // }
  // const student = params;

  const studentId = "id";

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <StudentInfo studentId={studentId} />
          <ParentInfo studentId={studentId} />
        </div>
        <div className="space-y-6">
          <CourseInfo studentId={studentId} />
          <PaymentInfo studentId={studentId} />
        </div>
      </div>
      <ActionButtons studentId={studentId} className="mt-6" />
    </div>
  );
}
