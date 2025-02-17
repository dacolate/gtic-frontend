// import prisma from "@/lib/prisma";
import Image from "next/image";

const StatCard =
  // async
  ({ type }: { type: "student" | "class" | "teacher" | "payment" }) => {
    return (
      <div className="rounded-2xl odd:bg-green-600 even:bg-gray-300 p-4 flex-1 min-w-[100px] mx-3 my-3">
        <div className="flex justify-between items-center">
          <span className="">
            <Image src="/more.png" alt="" width={20} height={20} />
          </span>
          <div className="flex gap-2">
            {/* <Image src="/more.png" alt="" width={20} height={20} /> */}
            <Image src="/edit.png" alt="" width={20} height={20} />
          </div>
        </div>
        <h1 className="text-2xl font-semibold my-4">
          {/* {data} */}
          10
        </h1>
        {type === "student" && (
          <h2 className="capitalize text-sm font-medium text-gray-700">
            {type}s
          </h2>
        )}
        {type === "teacher" && (
          <h2 className="capitalize text-sm font-medium text-gray-700">
            {type}s
          </h2>
        )}
        {type === "payment" && (
          <h2 className="capitalize text-sm font-medium text-gray-700">
            {type}s{" "}
            <span className="text-xs font-serif normal-case text-gray-400 ">
              {" "}
              today
            </span>
          </h2>
        )}
        {type === "class" && (
          <h2 className="capitalize text-sm font-medium text-gray-700">
            {type}es
          </h2>
        )}
      </div>
    );
  };

export default StatCard;
