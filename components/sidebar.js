"use client";

import {
  Users,
  GamepadIcon,
  HomeIcon,
  Activity,
  CheckSquare,
  BookOpen,
  Calendar,
  Bell,
  Home,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next/client";
import Link from "next/link";



export function Sidebar({
  activeSection,
  setActiveSection,
  isOpen,
  setIsOpen,
}) {
  const email = getCookie("email");
  const name = getCookie("name");
  const menuItems = [

    {
      id: "/",
      label: "الرئيسية",
      icon: HomeIcon,
    },
    {
      id: "/users",
      label: "إدارة المستخدمين",
      icon: Users,
    },
    {
      id: "/games",
      label: "إدارة الألعاب",
      icon: GamepadIcon,
    },
    {
      id: "/sugar",
      label: " سجل الحالة الصحية",
      icon: Activity,
    },
    {
      id: "/tasks",
      label: "إدارة المهام",
      icon: CheckSquare,
    },
    {
      id: "/content",
      label: "المحتوى التعليمي",
      icon: BookOpen,
    },
    {
      id: "/appointments",
      label: "إدارة المواعيد",
      icon: Calendar,
    },
    {
      id: "/notifications",
      label: "المنبهات والإشعارات",
      icon: Bell,
    },
  ];

  const handleMenuItemClick = (id) => {
    setActiveSection(id);
    // على الشاشات الصغيرة، أغلق الشريط الجانبي عند النقر على عنصر
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* خلفية معتمة عند فتح الشريط الجانبي على الشاشات الصغيرة */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 bg-[#1a1b1e] text-white flex flex-col h-full transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:z-0",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#ffffff] rounded-full ">
              {/* <Home className="h-5 w-5 text-white" /> */}
              <img src="/logo.png" alt="logo" className="h-10 w-20   object-contain " />
            </div>
            <span className="text-xl font-bold">عسول</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">إغلاق</span>
          </Button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.id}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-lg transition-colors",
                    activeSection === item.id
                      ? "bg-[#ffac33] text-white"
                      : "hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffac33] flex items-center justify-center flex-shrink-0">
              م
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{name}</p>
              <p className="text-sm text-gray-400 truncate">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
