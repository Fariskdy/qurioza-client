import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreVertical,
  Search,
  Users,
  Clock,
  Star,
  BookOpen,
  Sparkles,
  GraduationCap,
  BarChart2,
  TrendingUp,
  CheckCircle,
  LayoutGrid,
  Trash,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCoordinatorCourses,
  useDeleteCourse,
  usePublishCourse,
} from "@/api/courses";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CreateCourseDialog from "@/components/courses/CreateCourseDialog";
import EditCourseDialog from "@/components/courses/EditCourseDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DeleteCourseDialog from "@/components/courses/DeleteCourseDialog";
import PublishCourseDialog from "@/components/courses/PublishCourseDialog";

function CourseCard({ course, onEdit }) {
  const deleteMutation = useDeleteCourse();
  const publishMutation = usePublishCourse();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(course._id);
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(course._id);
      toast.success("Course published successfully");
      setShowPublishDialog(false);
    } catch (error) {
      toast.error("Failed to publish course");
    }
  };

  const handleViewDetails = () => {
    navigate(`/dashboard/courses/${course.slug}`);
  };

  return (
    <>
      <Card className="group overflow-hidden border dark:border-[#2A3F47] dark:bg-[#202F36] hover:shadow-xl transition-all duration-300">
        {/* Course Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10" />
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

          {/* Course Image */}
          <img
            src={course.image || "/placeholder-course.jpg"}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Badge
              variant={
                course.status === "published" ? "secondary" : "secondary"
              }
              className={cn(
                "bg-white/95 dark:bg-black/80 backdrop-blur-sm",
                course.status === "published"
                  ? "text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50"
                  : "text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/50"
              )}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    course.status === "published"
                      ? "bg-green-500 dark:bg-green-400"
                      : "bg-zinc-400 dark:bg-zinc-500"
                  )}
                />
                {course.status === "published" ? "Published" : "Draft"}
              </div>
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-sm hover:bg-white/90 dark:hover:bg-black/90"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(course)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/dashboard/courses/${course.slug}/modules`)
                  }
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Manage Modules
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/dashboard/courses/${course.slug}/batches`)
                  }
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Batches
                </DropdownMenuItem>
                {course.status !== "published" && (
                  <DropdownMenuItem onClick={() => setShowPublishDialog(true)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Course Info */}
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {course.category.name}
                </div>
                <Link
                  to={`/dashboard/courses/${course.slug}`}
                  className="group/title block"
                >
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover/title:text-primary/90 transition-colors dark:text-zinc-100">
                    {course.title}
                  </h3>
                </Link>
              </div>
              <div className="font-semibold text-xl text-primary dark:text-violet-400">
                ${course.price}
              </div>
            </div>

            {/* Compact Stats */}
            <div className="grid grid-cols-4 gap-3 py-3 border-y dark:border-[#2A3F47]">
              {/* Students */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {course.stats.enrolledStudents}
                  </div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-yellow-50 dark:bg-yellow-500/10">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {course.stats.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-violet-50 dark:bg-violet-500/10">
                  <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">{course.duration}w</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10">
                  <BarChart2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {course.stats.completionRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Completion
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600"
                asChild
              >
                <Link to={`/dashboard/courses/${course.slug}/modules`}>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Manage Modules
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                onClick={handleViewDetails}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteCourseDialog
        course={course}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />

      <PublishCourseDialog
        course={course}
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        onConfirm={handlePublish}
      />
    </>
  );
}

function StatsDialog() {
  const { data: coursesData } = useCoordinatorCourses();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="group fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 p-0 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl dark:from-violet-600 dark:to-purple-600"
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/0 to-purple-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg_180deg,white_180deg_360deg)] opacity-10 blur-xl animate-spin-slow" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent" />
          </div>

          {/* Pulsing ring effect */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 opacity-0 blur transition-all duration-500 group-hover:opacity-30 group-hover:blur-md" />

          {/* Icon container */}
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Main icon */}
            <BarChart2 className="h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110" />

            {/* Floating particles */}
            <div className="absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:animate-particle-1" />
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:animate-particle-2" />
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:animate-particle-3" />
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 animate-ping rounded-full bg-white/20 duration-1000" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl tracking-tight dark:text-zinc-100">
              Course Analytics
            </DialogTitle>
            <DialogDescription className="text-base dark:text-zinc-400">
              Real-time insights into your course performance
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <motion.div
            className="grid grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {/* Total Courses */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/[0.07] to-purple-500/[0.07] dark:from-violet-500/[0.15] dark:to-purple-500/[0.15] p-6 hover:from-violet-500/[0.12] hover:to-purple-500/[0.12] dark:hover:from-violet-500/[0.2] dark:hover:to-purple-500/[0.2] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-2 w-fit rounded-xl bg-violet-500/10 dark:bg-violet-500/20">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Total Courses
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                      >
                        {coursesData?.courses?.length || 0}
                      </motion.span>
                      <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        12%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1 w-full bg-violet-500/10 dark:bg-violet-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-violet-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Active Students */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/[0.07] to-cyan-500/[0.07] dark:from-blue-500/[0.15] dark:to-cyan-500/[0.15] p-6 hover:from-blue-500/[0.12] hover:to-cyan-500/[0.12] dark:hover:from-blue-500/[0.2] dark:hover:to-cyan-500/[0.2] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-2 w-fit rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Active Students
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                      >
                        479
                      </motion.span>
                      <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        20.1%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1 w-full bg-blue-500/10 dark:bg-blue-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Average Rating */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/[0.07] to-orange-500/[0.07] dark:from-yellow-500/[0.15] dark:to-orange-500/[0.15] p-6 hover:from-yellow-500/[0.12] hover:to-orange-500/[0.12] dark:hover:from-yellow-500/[0.2] dark:hover:to-orange-500/[0.2] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-yellow-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="p-2 w-fit rounded-xl bg-yellow-500/10 dark:bg-yellow-500/20">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Average Rating
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                      >
                        4.8
                      </motion.span>
                      <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        0.5%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1 w-full bg-yellow-500/10 dark:bg-yellow-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Courses() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [level, setLevel] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: coursesData, isLoading, error } = useCoordinatorCourses();

  // Filter courses based on search, status, and level
  const filteredCourses = useMemo(() => {
    if (!coursesData?.courses) return [];

    return coursesData.courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "all" || course.status === status;
      const matchesLevel = level === "all" || course.level === level;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [coursesData?.courses, search, status, level]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading courses: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        {/* Title and Create Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">
              Courses
            </h1>
            <p className="text-muted-foreground dark:text-[#8B949E]">
              Manage and monitor your courses
            </p>
          </div>
          <CreateCourseDialog />
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by title..."
              className="pl-10 w-full bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100 dark:placeholder:text-zinc-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[130px] bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      status === "published"
                        ? "bg-emerald-500"
                        : status === "draft"
                        ? "bg-zinc-400"
                        : "bg-blue-500"
                    )}
                  />
                  <SelectValue
                    placeholder="Status"
                    className="dark:text-zinc-400"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-[130px] bg-white/50 dark:bg-[#202F36]/50 backdrop-blur-sm border-zinc-200 dark:border-[#2A3F47] dark:text-zinc-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <SelectValue
                    placeholder="Level"
                    className="dark:text-zinc-400"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onEdit={(course) => {
              setSelectedCourse(course);
              setEditDialogOpen(true);
            }}
          />
        ))}
      </div>

      {selectedCourse && (
        <EditCourseDialog
          key={selectedCourse._id}
          course={selectedCourse}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
      <StatsDialog />
    </div>
  );
}

export default Courses;
