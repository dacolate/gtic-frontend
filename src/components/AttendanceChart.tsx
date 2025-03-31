"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) => {
  // Add fallback for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No attendance data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      {" "}
      {/* Fixed height container */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6b7280" }} // Changed to gray-500 for better visibility
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#6b7280" }} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "lightgray",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{
              paddingBottom: "20px",
            }}
            iconSize={10}
            iconType="circle"
          />
          <Bar
            dataKey="present"
            name="Present"
            fill="#FAE27C"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="absent"
            name="Absent"
            fill="#A10001"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
