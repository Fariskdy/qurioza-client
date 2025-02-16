import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  PenTool,
  GraduationCap,
  Settings,
  Users,
  School,
  BarChart2,
  Layers,
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
      // {
      //   name: "Certificates",
      //   href: "/dashboard/certificates",
      //   icon: GraduationCap,
      // },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],

    TEACHER: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "My Classes",
        href: "/dashboard/classes",
        icon: School,
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
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],

    "COURSE COORDINATOR": [
      {
        name: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Course Management",
        href: "/dashboard/courses",
        icon: BookOpen,
        matchPaths: [
          "/dashboard/courses",
          "/dashboard/courses/:slug",
          "/dashboard/courses/:slug/modules",
          "/dashboard/courses/:slug/batches",
          "/dashboard/courses/:slug/batches/:batchId",
        ],
        children: [
          {
            name: "All Courses",
            href: "/dashboard/courses",
          },
          {
            name: "Active Courses",
            href: "/dashboard/courses?status=published",
          },
          {
            name: "Draft Courses",
            href: "/dashboard/courses?status=draft",
          },
        ],
      },
      {
        name: "Teacher Management",
        href: "/dashboard/teachers",
        icon: Users,
        children: [
          {
            name: "All Teachers",
            href: "/dashboard/teachers",
          },
          {
            name: "Teacher Schedule",
            href: "/dashboard/teachers/schedule",
          },
        ],
      },
      // {
      //   name: "Analytics",
      //   href: "/dashboard/analytics",
      //   icon: BarChart2,
      //   children: [
      //     {
      //       name: "Course Analytics",
      //       href: "/dashboard/analytics/courses",
      //     },
      //     {
      //       name: "Student Analytics",
      //       href: "/dashboard/analytics/students",
      //     },
      //   ],
      // },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
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
      },
      {
        name: "Category Management",
        href: "/dashboard/categories",
        icon: Layers,
      },
      // {
      //   name: "Analytics",
      //   href: "/dashboard/analytics",
      //   icon: BarChart2,
      // },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  };

  // Return navigation config for the active role, or empty array as fallback
  return navigationByRole[userRole.toUpperCase()] || [];
};
