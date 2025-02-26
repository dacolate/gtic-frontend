import { useTranslations } from "next-intl";
import Image from "next/image";
import AttendanceChart from "./AttendanceChart";

const AttendanceChartContainer = () => {
  const t = useTranslations("AttendanceChart");

  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const daysOfWeek = [
    t("days.mon"),
    t("days.tue"),
    t("days.wed"),
    t("days.thu"),
    t("days.fri"),
  ];

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: 50,
    absent: 15,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">{t("title")}</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
