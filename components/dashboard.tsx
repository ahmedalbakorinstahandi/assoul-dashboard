"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { UserManagement } from "@/components/user-management";
import { GamesManagement } from "@/components/games-management";
import { SugarMonitoring } from "@/components/sugar-monitoring";
import { TasksManagement } from "@/components/tasks-management";
import { ContentManagement } from "@/components/content-management";
import { AppointmentsManagement } from "@/components/appointments-management";
import { NotificationsManagement } from "@/components/notifications-management";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/styles/globals.css";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "games":
        return <GamesManagement />;
      case "sugar":
        return <SugarMonitoring />;
      case "tasks":
        return <TasksManagement />;
      case "content":
        return <ContentManagement />;
      case "appointments":
        return <AppointmentsManagement />;
      case "notifications":
        return <NotificationsManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <main className="flex-1 overflow-auto p-3 md:p-6">{renderSection()}</main>
      {/* </div> */}
    </div>
  );
}
