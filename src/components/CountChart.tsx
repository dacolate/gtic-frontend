"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  // Legend,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({
  late,
  threeday,
  sevenday,
}: {
  late: number;
  threeday: number;
  sevenday: number;
}) => {
  const data = [
    {
      name: "total",
      count: late + threeday + sevenday,
      fill: "white",
    },
    {
      name: "Late payments",
      count: late,
      fill: "red",
    },
    {
      name: "Due in 3 days",
      count: threeday,
      fill: "#FAE27C",
    },
    {
      name: "Due in 7 days",
      count: sevenday,
      fill: "#16a34a",
    },
  ];
  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src="/finance.png"
        alt=""
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default CountChart;
