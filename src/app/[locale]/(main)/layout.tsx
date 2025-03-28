// import Menu from "@/components/Menu";
import Menu from "@/components/Menu";
import Navbar from "@/components/NavBar";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import Providers from "./provider";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] text-center">
        <Link href="/" className="flex items-center justify-center gap-2 ">
          <Image src="/gtic.png" alt="GTIC" width={48} height={48} />
          {/* <span className="hidden lg:block font-bold">GTIC </span> */}
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        <Providers>{children}</Providers>
      </div>
    </div>
  );
}
