import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/api/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  ArrowLeft,
  ChevronRight,
  Plus,
  Clock,
  CalendarDays,
  UserPlus,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import CreateBatchDialog from "@/components/batches/CreateBatchDialog";
import { useState } from "react";
import { useBatches } from "@/api/batches";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export function BatchManagement() {
  const { slug } = useParams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(slug);

  // Replace mock data with API data
  const {
    data: batches,
    isLoading: batchesLoading,
    error: batchesError,
  } = useBatches(course?._id);

  // Filter batches based on search and status
  const filteredBatches =
    batches?.filter((batch) => {
      const matchesSearch = `Batch #${batch.batchNumber}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || batch.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) ?? [];

  if (courseLoading || batchesLoading) {
    return <BatchManagementSkeleton />;
  }

  if (courseError || batchesError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">
          {courseError?.message ||
            batchesError?.message ||
            "Error loading data"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/dashboard/courses/${slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              {/* Breadcrumb Navigation */}
              <div className="flex items-center">
                <nav className="flex items-center text-sm">
                  <Link
                    to="/dashboard/courses"
                    className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Courses</span>
                  </Link>

                  <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />

                  <Link
                    to={`/dashboard/courses/${slug}`}
                    className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors max-w-[200px] truncate"
                  >
                    {course.title}
                  </Link>

                  <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />

                  <span className="text-foreground dark:text-white font-medium flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-violet-500" />
                    Batches
                  </span>
                </nav>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Plus className="h-4 w-4" /> Create New Batch
          </Button>
        </div>

        {/* Course Info Card */}
        <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-violet-500/10 dark:border-[#2A3F47] dark:bg-[#202F36]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <Badge
                    variant={
                      course.status === "published" ? "success" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {course.category.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration} Weeks
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.stats.enrolledStudents} Students
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Total Batches"
            value={batches?.length || 0}
            icon={Calendar}
            description="All time batches"
          />
          <StatsCard
            title="Active Batches"
            value={
              batches?.filter((b) =>
                ["enrolling", "ongoing"].includes(b.status)
              ).length || 0
            }
            icon={Clock}
            description="Currently running"
            trend={+15}
          />
          <StatsCard
            title="Upcoming Batches"
            value={batches?.filter((b) => b.status === "upcoming").length || 0}
            icon={CalendarDays}
            description="Starting soon"
          />
          <StatsCard
            title="Total Students"
            value={batches?.reduce((acc, b) => acc + b.enrollmentCount, 0) || 0}
            icon={Users}
            description="Across all batches"
            trend={+8}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="enrolling">Enrolling</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batches List */}
        <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
          <CardHeader>
            <CardTitle className="dark:text-zinc-100">Course Batches</CardTitle>
            <CardDescription className="dark:text-zinc-400">
              Manage your course batches and enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y dark:divide-[#2A3F47]">
              {filteredBatches.map((batch) => (
                <BatchRow key={batch._id} batch={batch} courseSlug={slug} />
              ))}

              {filteredBatches.length === 0 && (
                <div className="text-center py-12">
                  <div className="space-y-3">
                    <UserPlus className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">No batches found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        {search || statusFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Create your first batch to start enrolling students"}
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create First Batch
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateBatchDialog
        courseId={course._id}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description, trend }) {
  return (
    <Card className="border dark:border-[#2A3F47] dark:bg-[#202F36]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10">
            <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold dark:text-zinc-100">
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
            <div className="text-sm text-muted-foreground dark:text-zinc-400">
              {title}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BatchRow({ batch, courseSlug }) {
  const statusColors = {
    upcoming:
      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-900/50",
    enrolling:
      "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-900/50",
    ongoing:
      "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-900/50",
    completed:
      "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-500/10 border-zinc-200 dark:border-zinc-800/50",
  };

  return (
    <Link
      to={`/dashboard/courses/${courseSlug}/batches/${batch._id}`}
      className="block p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium dark:text-zinc-100">
                Batch #{batch.batchNumber}
              </h3>
              <Badge
                variant="secondary"
                className={cn(
                  "capitalize bg-white/95 dark:bg-black/80 backdrop-blur-sm",
                  statusColors[batch.status]
                )}
              >
                {batch.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(batch.batchStartDate).toLocaleDateString()} -{" "}
                {new Date(batch.batchEndDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {batch.teachers.length} Teachers
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground dark:text-zinc-400" />
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground dark:text-zinc-400">
              Enrollment Progress
            </span>
            <span className="font-medium dark:text-zinc-100">
              {batch.enrollmentCount}/{batch.maxStudents} Students
            </span>
          </div>
          <Progress
            value={(batch.enrollmentCount / batch.maxStudents) * 100}
            className="h-2 dark:bg-zinc-800"
          />
        </div>
      </div>
    </Link>
  );
}

function BatchManagementSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Course Info Card Skeleton */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        {/* Batches List Skeleton */}
        <div className="border rounded-lg">
          <div className="p-6">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
