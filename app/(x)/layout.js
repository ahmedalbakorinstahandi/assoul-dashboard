"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"; // استيراد usePathname
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { getData } from "@/lib/apiHelper";
import { getTimeAgo } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // الحصول على المسار الحالي
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  useEffect(() => {
    const getNotifications = async () => {
      const response = await getData(
        `notifications/notifications?limit=5`,);
      if (response.success) {
        setNotifications(response.data)
      }
    }
    getNotifications()
  }, []);
  // تحديث activeSection بناءً على المسار
  useEffect(() => {
    const section = pathname.split("/")[1] || "/dashboard"; // استخراج القسم الأول من المسار
    setActiveSection(`/${section}`);
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
      deleteCookie("email");

      deleteCookie("name");
      deleteCookie("id");

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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full"
                  >
                    <Bell className="h-5 w-5" />
                    {/* <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span> */}
                    <span className="sr-only">الإشعارات</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 mt-1">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>الإشعارات</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs text-primary"
                    >
                      تعيين الكل كمقروء
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification, idx) => (
                    <DropdownMenuItem key={idx} onClick={() => { router.push("/notifications") }} className="flex flex-col items-start py-2 px-4 cursor-pointer focus:bg-accent">
                      <div className="flex w-full items-start gap-2">
                        {notification.read_at ? <>
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-gray-300 flex-shrink-0"></div>

                        </> : <>
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>

                        </>}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message && notification.message.length > 30
                              ? notification.message.substring(0, 30) + "..."
                              : notification.message}                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getTimeAgo(notification.created_at)}
                            {/* {new Date(notification.created_at).toLocaleString("EN-ca")} */}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {/* إشعار جديد */}


                  {/* إشعار مقروء */}
                  {/* <DropdownMenuItem className="flex flex-col items-start py-2 px-4 cursor-pointer focus:bg-accent">
                    <div className="flex w-full items-start gap-2">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-gray-300 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">تقييم جديد</p>
                        <p className="text-xs text-muted-foreground">
                          قام مستخدم بتقييم صالون الجمال
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          منذ ساعتين
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex flex-col items-start py-2 px-4 cursor-pointer focus:bg-accent">
                    <div className="flex w-full items-start gap-2">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-gray-300 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">دفع جديد</p>
                        <p className="text-xs text-muted-foreground">
                          تم استلام دفعة جديدة بقيمة 150 ريال
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          أمس، 14:30
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem> */}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary cursor-pointer" onClick={() => { router.push("/notifications") }}>

                    عرض جميع الإشعارات
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        <Suspense fallback={<Spinner />}>
          <main className="flex-1 overflow-auto p-3 md:p-6">
            <Toaster position="top-right" reverseOrder={false} />
            {children}
          </main>
        </Suspense>
      </div>
    </div>
    //     </Providers>
    //   </body>
    // </html>
  );
}
