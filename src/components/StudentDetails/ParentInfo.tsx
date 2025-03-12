import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/lib/types";
import InitialsAvatar from "../InitialsAvatar";
import { capitalizeFullName } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function ParentInfo({ student }: { student: Student }) {
  const parent = student.parents ? student.parents[0] : null;

  const t = useTranslations("StudentInfo");

  if (!parent) {
    return (
      <p className="text-gray-400">{t("No parent information available")}.</p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <InitialsAvatar name={parent.name || "-"} size={13} />
          <div>
            <p className="text-xl">{capitalizeFullName(parent.name) || "-"}</p>
            <p className="text-sm text-gray-500">{t("parent")}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-500">{t("phone")}</dt>
            <dd>{parent.phone || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">{t("email")}</dt>
            <dd>{parent.email || "-"}</dd>
          </div>
          {/* <div className="sm:col-span-2">
            <dt className="font-medium text-gray-500">Address</dt>
            <dd>{parent.address || "-"}</dd>
          </div> */}
        </dl>
      </CardContent>
    </Card>
  );
}
