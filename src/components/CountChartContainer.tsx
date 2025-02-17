import Image from "next/image";
import CountChart from "./CountChart";
// import CountChart from "./CountChart";
// import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  //   const data = await prisma.student.groupBy({
  //     by: ["sex"],
  //     _count: true,
  //   });

  //   const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  //   const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;

  const late = 30;
  const threeday = 24;
  const sevenday = 200;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Payments</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <CountChart late={late} threeday={threeday} sevenday={sevenday} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <h1 className="font-bold">{late}</h1>
          <h2 className="text-xs text-gray-300">Late payments</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-3 h-3 bg-[#FAE27C] rounded-full" />
          <h1 className="font-bold">{threeday}</h1>
          <h2 className="text-xs text-gray-300">Due in 3 days</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-3 h-3 bg-[#16a34a] rounded-full" />
          <h1 className="font-bold">{sevenday}</h1>
          <h2 className="text-xs text-gray-300">Due in 7 days</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
