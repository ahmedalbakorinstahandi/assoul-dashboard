"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";

import { usePathname } from "next/navigation"; // استيراد usePathname
import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/providers"
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // الحصول على المسار الحالي
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // تحديث activeSection بناءً على المسار
  useEffect(() => {
    const section = pathname.split("/")[1] || "dashboard"; // استخراج القسم الأول من المسار
    setActiveSection(section);
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <html lang="ar" >
      <body >
        <Providers>
          {/* 
          <div className="flex h-screen bg-background overflow-hidden"> */}

          {/* <main className="flex-1 overflow-auto p-3 md:p-6"> */}
          <Toaster position="top-right" reverseOrder={false} />
          {children}
          {/* </main> */}

          {/* </div>*/}
        </Providers>
      </body>
    </html>
  );
}
