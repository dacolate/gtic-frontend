"use client";
import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

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
    // Total should be last to render behind others
    {
      name: "total",
      count: late + threeday + sevenday,
      fill: "#f0f0f0", // Changed from white to light gray for better visibility
    },
  ];

  return (
    <div className="relative w-full h-[300px]">
      {" "}
      {/* Fixed height */}
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={16} // Reduced for better visibility
          data={data}
          startAngle={90} // Start from top
          endAngle={-270} // Full circle
        >
          <RadialBar
            // minAngle={15}
            background
            // clockWise
            dataKey="count"
            cornerRadius={8}
          />
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
