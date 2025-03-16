"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"; // استيراد usePathname
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // الحصول على المسار الحالي
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter()


  // تحديث activeSection بناءً على المسار
  useEffect(() => {
    const section = pathname.split("/")[1] || "dashboard"; // استخراج القسم الأول من المسار
    setActiveSection(section);
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleLogout = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No active session found.");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_AUTH}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      deleteCookie("token");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout Error:", error);
    }
  };
  return (
    // <html lang="ar" dir="rtl">
    //   <body className={inter.className}>
    //     <Providers>
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">فتح القائمة</span>
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">
              لوحة تحكم عسول
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />
            <div className="flex items-center gap-2">
              {/* <span className="text-sm font-medium hidden sm:inline">
                مرحباً، المدير
              </span> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* <Button variant="outline" size="icon"> */}

                  <div className="w-8 cursor-pointer h-8 md:w-10 md:h-10 rounded-full bg-[#ffac33] flex items-center justify-center text-white">
                    م
                  </div>
                  {/* </Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>تسجيل الخروج</DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <Toaster position="top-right" reverseOrder={false} />

          {children}
        </main>
      </div>
    </div>
    //     </Providers>
    //   </body>
    // </html>
  );
}
