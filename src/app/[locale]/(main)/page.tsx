// import Image from "next/image";

import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import Dashboard from "@/components/Dashboard";

function Home() {
  return (
    <main className="flex flex-col gap-3">
      <Dashboard />
      <div className="flex lg:justify-start gap-3 flex-col lg:flex-row w-full h-full">
        <div className="mx-3 w-full h-full bg-yellow-500">
          <CountChartContainer />
        </div>
        <div className="mx-3 w-full h-full">
          <AttendanceChartContainer />
        </div>
      </div>
      {/* <DataTableDemo /> */}
    </main>
  );
}

export default Home;
