"use client"

"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  BookOpen,
  LogOut,
  User as UserIcon,
  GraduationCap,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  team: {
    name: "Attendify",
    logo: GraduationCap,
    plan: "Student",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "My Calendar",
      url: "/calendar",
      icon: CalendarIcon,
    },
    {
      title: "My Lectures",
      url: "/lectures",
      icon: BookOpen,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("name") || "Student";
      const uid = localStorage.getItem("uid") || "";
      setUserName(name);
      setUserEmail(uid ? `${uid}@student.edu` : "student@example.com");
    }
  }, []);

  const user = {
    name: userName,
    email: userEmail,
    avatar: "/avatars/student.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2">
          <TeamSwitcher teams={[data.team]} />
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
