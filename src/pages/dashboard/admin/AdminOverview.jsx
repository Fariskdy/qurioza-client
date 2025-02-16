import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Layers,
  UserCog,
  GraduationCap,
  Clock,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useCategories } from "@/api/categories/hooks";
import { useCoordinators } from "@/api/coordinators/hooks";

export default function AdminOverview() {
  // Fetch data
  const { data: categories = [] } = useCategories();
  const { data: coordinators = [] } = useCoordinators();

  // Calculate real stats from the data
  const stats = [
    {
      title: "Total Categories",
      value: categories.length,
      trend: categories.length > 0 ? "+12%" : "0%", // You might want to calculate real trend
      trendUp: true,
      icon: Layers,
      description: "Active course categories",
      color: "violet",
    },
    {
      title: "Total Coordinators",
      value: coordinators.length,
      trend: coordinators.length > 0 ? "+8%" : "0%", // You might want to calculate real trend
      trendUp: true,
      icon: UserCog,
      description: "Course coordinators",
      color: "blue",
    },
    {
      title: "Total Courses",
      value: categories.reduce((acc, cat) => acc + (cat.coursesCount || 0), 0),
      trend: "+18%", // Calculate based on historical data if available
      trendUp: true,
      icon: BookOpen,
      description: "Active courses",
      color: "orange",
    },
    {
      title: "Active Coordinators",
      value: coordinators.filter((coord) => coord.status === "active").length,
      trend: "+24%", // Calculate based on historical data if available
      trendUp: true,
      icon: Users,
      description: "Currently active coordinators",
      color: "green",
    },
  ];

  // Calculate recent activity from actual data
  const recentActivity = [
    // Categories
    ...categories.slice(0, 2).map((category) => ({
      type: "category",
      action: "created",
      name: category.name,
      time: new Date(category.createdAt).toLocaleDateString(),
      icon: Layers,
    })),
    // Coordinators
    ...coordinators.slice(0, 2).map((coordinator) => ({
      type: "coordinator",
      action: "joined",
      name: `${coordinator.firstName} ${coordinator.lastName}`,
      time: new Date(coordinator.createdAt).toLocaleDateString(),
      icon: UserCog,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 3);

  // Calculate platform analytics from real data
  const analytics = [
    {
      label: "Total Categories",
      value: categories.length,
      icon: Layers,
      color: "text-blue-500",
    },
    {
      label: "Active Coordinators",
      value: coordinators.filter((coord) => coord.status === "active").length,
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Completion Rate",
      value: "78%", // This would need to come from course completion data
      icon: BarChart2,
      color: "text-orange-500",
    },
  ];

  const colorVariants = {
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border dark:border-[#2A3F47] dark:bg-[#202F36]"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${colorVariants[stat.color]}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trendUp ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={stat.trendUp ? "text-green-500" : "text-red-500"}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-foreground dark:text-white">
                  {stat.value}
                </h2>
                <p className="text-sm font-medium text-foreground dark:text-[#E3E5E5]">
                  {stat.title}
                </p>
                <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
          <CardHeader>
            <CardTitle className="text-foreground dark:text-white">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-muted-foreground dark:text-[#8B949E]">
              Latest updates from your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/5 dark:hover:bg-[#2A3F47]/50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "category"
                          ? colorVariants.violet
                          : colorVariants.blue
                      }`}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground dark:text-[#E3E5E5]">
                        {activity.name}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-[#8B949E]">
                        {activity.action} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Analytics */}
        <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
          <CardHeader>
            <CardTitle className="text-foreground dark:text-white">
              Platform Analytics
            </CardTitle>
            <CardDescription className="text-muted-foreground dark:text-[#8B949E]">
              Key metrics and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 dark:hover:bg-[#2A3F47]/50"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-sm font-medium text-foreground dark:text-[#E3E5E5]">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground dark:text-[#8B949E]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
