import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  PenTool,
  GraduationCap,
  Settings,
  Users,
  BookMarked,
  School,
  Calendar,
  MessageSquare,
  BarChart2,
  FolderPlus,
  Layers,
  Bell,
} from "lucide-react";

export const getNavigationConfig = (userRole) => {
  // If no role, return empty navigation
  if (!userRole) return [];

  const navigationByRole = {
    STUDENT: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "My Courses",
        href: "/dashboard/courses",
        icon: BookOpen,
      },
      {
        name: "Assignments",
        href: "/dashboard/assignments",
        icon: ClipboardCheck,
      },
      {
        name: "Quizzes",
        href: "/dashboard/quizzes",
        icon: PenTool,
      },
      {
        name: "Certificates",
        href: "/dashboard/certificates",
        icon: GraduationCap,
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],

    TEACHER: [
      {
        name: "Dashboard",
        href: "/dashboard/teacher",
        icon: LayoutDashboard,
      },
      {
        name: "My Classes",
        href: "/dashboard/classes",
        icon: School,
      },
      {
        name: "Students",
        href: "/dashboard/students",
        icon: Users,
      },
      {
        name: "Assignments",
        href: "/dashboard/assignments",
        icon: ClipboardCheck,
      },
      {
        name: "Course Material",
        href: "/dashboard/materials",
        icon: BookMarked,
      },
      {
        name: "Schedule",
        href: "/dashboard/schedule",
        icon: Calendar,
      },
      {
        name: "Messages",
        href: "/dashboard/messages",
        icon: MessageSquare,
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],

    "COURSE COORDINATOR": [
      {
        name: "Overview",
        href: "/dashboard/coordinator",
        icon: LayoutDashboard,
      },
      {
        name: "Course Management",
        href: "/dashboard/courses",
        icon: BookOpen,
        children: [
          {
            name: "All Courses",
            href: "/dashboard/courses/list",
            icon: Layers,
          },
          {
            name: "Create Course",
            href: "/dashboard/courses/create",
            icon: FolderPlus,
          },
          {
            name: "Categories",
            href: "/dashboard/courses/categories",
            icon: BookMarked,
          },
        ],
      },
      {
        name: "Batch Management",
        href: "/dashboard/batches",
        icon: School,
        children: [
          {
            name: "Active Batches",
            href: "/dashboard/batches/active",
          },
          {
            name: "Upcoming Batches",
            href: "/dashboard/batches/upcoming",
          },
          {
            name: "Completed Batches",
            href: "/dashboard/batches/completed",
          },
        ],
      },
      // ... rest of coordinator navigation
    ],

    ADMIN: [
      {
        name: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Coordinator Management",
        href: "/dashboard/coordinators",
        icon: Users,
        children: [
          {
            name: "All Coordinators",
            href: "/dashboard/admin/coordinators/list",
          },
          {
            name: "Add Coordinator",
            href: "/dashboard/admin/coordinators/add",
          },
        ],
      },
      {
        name: "Category Management",
        href: "/dashboard/categories",
        icon: Layers,
        children: [
          {
            name: "All Categories",
            href: "/dashboard/admin/categories/list",
          },
          {
            name: "Add Category",
            href: "/dashboard/admin/categories/add",
          },
        ],
      },
      {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart2,
        children: [
          {
            name: "User Statistics",
            href: "/dashboard/analytics/users",
          },
          {
            name: "Course Statistics",
            href: "/dashboard/analytics/courses",
          },
          {
            name: "Revenue Reports",
            href: "/dashboard/analytics/revenue",
          },
        ],
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        children: [
          {
            name: "General",
            href: "/dashboard/settings/general",
          },
          {
            name: "System Settings",
            href: "/dashboard/settings/system",
          },
        ],
      },
    ],
  };

  // Return navigation config for the active role, or empty array as fallback
  return navigationByRole[userRole.toUpperCase()] || [];
};
