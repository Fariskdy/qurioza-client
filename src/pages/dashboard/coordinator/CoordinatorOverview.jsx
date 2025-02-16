import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  Star,
  UserPlus,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTeachers } from "@/api/teachers";
import { useCoordinatorCourses } from "@/api/courses";
import { useBatches } from "@/api/batches";

function CoordinatorOverview() {
  const navigate = useNavigate();

  // Fetch data using our existing hooks
  const { data: teachers = [] } = useTeachers();
  const { data: coursesData } = useCoordinatorCourses();
  const courses = coursesData?.courses || [];
  const { data: batches = [] } = useBatches();

  // Derive statistics
  const stats = {
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter((t) => t.status === "active").length,
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.status === "published").length,
    totalBatches: batches.length,
    activeBatches: batches.filter((b) => b.status === "ongoing").length,
    upcomingBatches: batches.filter((b) => b.status === "upcoming").length,
    totalStudents: batches.reduce((acc, b) => acc + b.enrollmentCount, 0),
    averageRating:
      courses.reduce((acc, c) => acc + c.stats.rating, 0) / courses.length,
  };

  return (
    <div className="space-y-8">
      {/* Header with improved styling */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-[#E3E5E5]">
            Welcome to Your Dashboard
          </h1>
          <p className="text-muted-foreground dark:text-[#8B949E]">
            Here&apos;s what&apos;s happening with your courses and teaching
            staff.
          </p>
        </div>

        {/* Quick Stats Grid with improved styling */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={Users}
            trend={+12}
            linkTo="/dashboard/teachers"
            color="violet"
          />
          <StatsCard
            title="Active Courses"
            value={stats.publishedCourses}
            icon={BookOpen}
            trend={+8}
            linkTo="/dashboard/courses"
            color="blue"
          />
          <StatsCard
            title="Running Batches"
            value={stats.activeBatches}
            icon={Calendar}
            trend={+15}
            color="emerald"
          />
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={GraduationCap}
            trend={+24}
            color="amber"
          />
        </div>
      </div>

      {/* Course Overview with improved card styling */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Course Stats */}
        <Card className="md:col-span-4 border dark:border-[#2A3F47] dark:bg-[#202F36] group relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/[0.05] dark:to-purple-500/[0.05]" />
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

          <CardHeader className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <CardTitle className="text-foreground dark:text-[#E3E5E5]">
                Course Overview
              </CardTitle>
            </div>
            <CardDescription className="dark:text-[#8B949E]">
              Performance metrics for your courses
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-8">
              {/* Course Status Distribution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Published vs Draft Courses
                  </span>
                  <span className="font-medium">
                    {stats.publishedCourses}/{stats.totalCourses}
                  </span>
                </div>
                <Progress
                  value={(stats.publishedCourses / stats.totalCourses) * 100}
                  className="h-2"
                />
              </div>

              {/* Recent Courses */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Recent Courses</h4>
                <div className="space-y-2">
                  {courses.slice(0, 3).map((course) => (
                    <Link
                      key={course._id}
                      to={`/dashboard/courses/${course.slug}`}
                      className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/50 dark:hover:bg-zinc-800/50 transition-colors dark:border-[#2A3F47] group"
                    >
                      <div className="h-10 w-10 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">
                            {course.title}
                          </h4>
                          <Badge
                            variant={
                              course.status === "published"
                                ? "success"
                                : "secondary"
                            }
                            className={cn(
                              "capitalize",
                              course.status === "published"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-zinc-100 dark:bg-zinc-800"
                            )}
                          >
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.stats.enrolledStudents} Students
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {course.stats.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Overview with improved styling */}
        <Card className="md:col-span-3 border dark:border-[#2A3F47] dark:bg-[#202F36] group relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/[0.05] dark:to-cyan-500/[0.05]" />
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

          <CardHeader className="relative">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-foreground dark:text-[#E3E5E5]">
                Upcoming Batches
              </CardTitle>
            </div>
            <CardDescription className="dark:text-[#8B949E]">
              Next starting batches
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {batches
                .filter((b) => b.status === "upcoming")
                .slice(0, 4)
                .map((batch) => (
                  <div
                    key={batch._id}
                    className="flex items-center gap-4 p-4 rounded-lg border dark:border-[#2A3F47] hover:bg-accent/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium dark:text-zinc-100">
                        Batch #{batch.batchNumber}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(batch.batchStartDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {batch.enrollmentCount}/{batch.maxStudents}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Empty state for no upcoming batches */}
              {batches.filter((b) => b.status === "upcoming").length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg dark:text-zinc-100">
                      No Upcoming Batches
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      There are no upcoming batches scheduled at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Overview with improved styling */}
      <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36] group relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/[0.05] dark:to-teal-500/[0.05]" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <CardHeader>
          <div>
            <CardTitle>Recent Teachers</CardTitle>
            <CardDescription>
              Latest additions to your teaching staff
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {teachers.slice(0, 3).map((teacher) => (
              <div
                key={teacher._id}
                className="p-4 rounded-lg border dark:border-[#2A3F47] space-y-3 transition-colors hover:bg-accent/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                onClick={() => navigate("/dashboard/teachers")}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center">
                    <span className="text-lg font-medium text-violet-600 dark:text-violet-400">
                      {teacher.firstName?.[0]}
                      {teacher.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {teacher.firstName} {teacher.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {teacher.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    Active
                  </Badge>
                  <span>·</span>
                  <span>
                    Joined {new Date(teacher.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Improved StatsCard with color variants
function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  linkTo,
  color = "violet",
}) {
  const colorVariants = {
    violet: {
      light: "bg-violet-50 dark:bg-violet-500/10",
      hover: "group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20",
      text: "text-violet-600 dark:text-violet-400",
      border: "hover:border-violet-200 dark:hover:border-violet-800",
    },
    blue: {
      light: "bg-blue-50 dark:bg-blue-500/10",
      hover: "group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-200 dark:hover:border-blue-800",
    },
    emerald: {
      light: "bg-emerald-50 dark:bg-emerald-500/10",
      hover: "group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-200 dark:hover:border-emerald-800",
    },
    amber: {
      light: "bg-amber-50 dark:bg-amber-500/10",
      hover: "group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-200 dark:hover:border-amber-800",
    },
  };

  return (
    <Link
      to={linkTo || "#"}
      className={cn(
        "block group transition-transform hover:-translate-y-0.5",
        linkTo && "cursor-pointer"
      )}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn(
          "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 dark:border-[#2A3F47] dark:bg-[#202F36]",
          colorVariants[color].border,
          "hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/10"
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/[0.05] dark:to-purple-500/[0.05]" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <div className="relative flex items-center gap-4">
          <div
            className={cn(
              "p-3 rounded-xl transition-colors",
              colorVariants[color].light,
              colorVariants[color].hover
            )}
          >
            <Icon className={cn("h-6 w-6", colorVariants[color].text)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold dark:text-[#E3E5E5]">
                {value}
              </span>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    trend > 0
                      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                      : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
                  )}
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground dark:text-[#8B949E]">
              {title}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default CoordinatorOverview;
