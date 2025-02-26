import { useTranslations } from "next-intl";
import Image from "next/image";

const StatCard = ({
  type,
}: {
  type: "student" | "class" | "teacher" | "payment";
}) => {
  const t = useTranslations("StatCard");

  return (
    <div className="rounded-2xl odd:bg-green-600 even:bg-gray-300 p-4 flex-1 min-w-[100px] mx-3 my-3">
      <div className="flex justify-between items-center">
        <span>
          <Image src="/more.png" alt="" width={20} height={20} />
        </span>
        <div className="flex gap-2">
          <Image src="/edit.png" alt="" width={20} height={20} />
        </div>
      </div>
      <h1 className="text-2xl font-semibold my-4">10</h1>
      <h2 className="capitalize text-sm font-medium text-gray-700">
        {t(`${type}`, { count: 10 })}
      </h2>
    </div>
  );
};

export default StatCard;
