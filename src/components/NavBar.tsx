"use client";

import { UserInfo } from "@/hooks/useAuth";
// import Image from "next/image";
import { Input } from "./ui/input";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

const Navbar = ({ userInfo }: { userInfo: UserInfo | undefined }) => {
  // const { userInfo } = useAuth();
  console.log("usb", userInfo);
  const t = useTranslations("Navbar");
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 py-8">
      <div className="flex-1 flex items-center">
        <div className="w-32 items-center gap-1 hidden md:flex">
          {/* <Image src="/gtic.png" alt="GTIC" width={48} height={48} /> */}
          {/* <MenuIcon /> */}
          <h1 className="text-xl font-bold text-green-600">MyGTIC</h1>
        </div>
        <div className="max-w-md w-full mr-2">
          <Input
            type="search"
            placeholder={`${t("Search")}...`}
            className="w-full bg-gray-50"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <button className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-600 rounded-full text-xs text-white flex items-center justify-center">
            1
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium">{userInfo?.name}</div>
            <div className="text-xs text-gray-500">{userInfo?.role}</div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
