"use client";

import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "user"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Courses",
        href: "/subjects",
        visible: ["admin", "user"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/classes",
        visible: ["admin", "user"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/attendance",
        visible: ["admin", "user"],
      },
      {
        icon: "/finance.png",
        label: "Payments",
        href: "/paiement",
        visible: ["admin", "user"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-2">
            {i.title}
          </span>
          {i.items.map((item) => {
            // if (item.visible.includes(role)) {
            return (
              <div
                key={item.label}
                className={` w-full  ${
                  pathname === item.href ? "bg-green-500 text-white" : ""
                }`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 px-2 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight ${
                    pathname === item.href ? "bg-green-500 text-white" : ""
                  }`}
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              </div>
            );
            // }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
