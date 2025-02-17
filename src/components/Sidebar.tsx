"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { Icons } from "./icons";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "Home",
        label: "Home",
        href: "/",
        visible: ["admin", "user"],
      },
      {
        icon: "Users",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "GraduationCap",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Users",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "BookOpen",
        label: "Courses",
        href: "/list/subjects",
        visible: ["admin", "user"],
      },
      {
        icon: "School",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "user"],
      },
      {
        icon: "ClipboardCheck",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "user"],
      },
      {
        icon: "CreditCard",
        label: "Payments",
        href: "/list/paiement",
        visible: ["admin", "user"],
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userInfo, logout } = useAuth();

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Your App Name</h1>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="text-sm text-gray-400 font-light mb-2">
                {section.title}
              </h2>
              {section.items.map((item) => {
                if (userInfo && item.visible.includes(userInfo.role)) {
                  const Icon = Icons[item.icon];
                  return (
                    <Link
                      href={item.href}
                      key={item.label}
                      className={`flex items-center py-2 px-4 rounded-md text-sm ${
                        pathname === item.href
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <Link
          href="/profile"
          className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
        >
          <User className="mr-3 h-5 w-5" />
          <span>Profile</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
        >
          <Settings className="mr-3 h-5 w-5" />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 rounded-md w-full text-left"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
