import { useStudentCourses } from "@/api/courses/hooks";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Loader2,
  Clock,
  BarChart2,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusIcons = {
  active: PlayCircle,
  completed: CheckCircle2,
  dropped: AlertCircle,
};

const statusStyles = {
  active: {
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-400/20",
  },
  completed: {
    color: "text-green-500 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-100 dark:border-green-400/20",
  },
  dropped: {
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-100 dark:border-red-400/20",
  },
};

const CourseCard = ({
  course,
  enrollmentStatus,
  progress,
  batch,
  enrollmentDate,
}) => {
  const StatusIcon = statusIcons[enrollmentStatus];
  const statusStyle = statusStyles[enrollmentStatus];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 
                 dark:border-gray-700/50 overflow-hidden hover:shadow-lg transition-all duration-200 
                 backdrop-blur-sm"
    >
      {/* Course Image with Improved Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image || "https://placehold.co/600x400"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <Badge
          className={`absolute top-4 left-4 ${statusStyle.color} ${statusStyle.bg} ${statusStyle.border} 
                     shadow-sm border backdrop-blur-sm`}
        >
          <StatusIcon className="w-4 h-4 mr-1" />
          {enrollmentStatus}
        </Badge>

        <Badge
          variant="outline"
          className="absolute top-4 right-4 bg-black/50 border-gray-600 text-white backdrop-blur-sm"
        >
          <Clock className="w-3 h-3 mr-1" />
          {course.duration} weeks
        </Badge>
      </div>

      {/* Course Content with Improved Layout */}
      <div className="p-5 space-y-5">
        {/* Title and Category */}
        <div>
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">
            {course.category?.name || "General"}
          </div>
          <h3
            className="text-lg font-semibold line-clamp-1 text-gray-900 dark:text-gray-100 
                         group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            {course.title}
          </h3>
        </div>

        {/* Progress Section with Enhanced Visual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground dark:text-gray-400 flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              Course Progress
            </span>
            <span
              className={`font-medium ${
                progress >= 80
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {progress}%
            </span>
          </div>
          <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-full
                ${progress >= 80 ? "bg-green-500" : "bg-blue-500"}
                ${progress >= 100 ? "animate-pulse" : ""}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Batch Info with Improved Layout */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-200 dark:border-gray-700/50">
          <div className="text-sm">
            <p className="text-muted-foreground dark:text-gray-400 text-xs mb-1">
              Current Batch
            </p>
            <p className="font-medium dark:text-gray-200">{batch.name}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground dark:text-gray-400 text-xs mb-1">
              Start Date
            </p>
            <p className="font-medium dark:text-gray-200">
              {format(new Date(batch.startDate), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* Action Button with Enhanced Style */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                     group shadow-sm transition-all duration-200 hover:shadow-blue-500/25 
                     hover:shadow-lg dark:text-white"
          asChild
        >
          <Link
            to={`/dashboard/courses/${course.slug}/learn`}
            className="flex items-center justify-center gap-2"
          >
            Continue Learning
            <PlayCircle className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default function StudentCourses() {
  const { data, isLoading, error } = useStudentCourses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Error loading courses</p>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          My Courses
        </h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Continue learning from where you left off
        </p>
      </div>

      {/* Tabs Section with dark mode support */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-violet-500/5 dark:bg-violet-500/10 p-1 border dark:border-violet-500/20">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white
                       dark:text-gray-300 dark:data-[state=active]:bg-violet-500
                       dark:data-[state=active]:text-white dark:hover:bg-violet-500/10
                       dark:data-[state=active]:shadow-none transition-all"
          >
            All Courses
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white
                       dark:text-gray-300 dark:data-[state=active]:bg-violet-500
                       dark:data-[state=active]:text-white dark:hover:bg-violet-500/10
                       dark:data-[state=active]:shadow-none transition-all"
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white
                       dark:text-gray-300 dark:data-[state=active]:bg-violet-500
                       dark:data-[state=active]:text-white dark:hover:bg-violet-500/10
                       dark:data-[state=active]:shadow-none transition-all"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.courses.map((enrollment) => (
              <CourseCard key={enrollment.course._id} {...enrollment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.courses
              .filter((enrollment) => enrollment.enrollmentStatus === "active")
              .map((enrollment) => (
                <CourseCard key={enrollment.course._id} {...enrollment} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.courses
              .filter(
                (enrollment) => enrollment.enrollmentStatus === "completed"
              )
              .map((enrollment) => (
                <CourseCard key={enrollment.course._id} {...enrollment} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {data?.courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-full bg-blue-50 w-fit mx-auto">
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">No courses yet</h3>
            <p className="text-muted-foreground">
              Start your learning journey by enrolling in a course
            </p>
            <Button asChild className="mt-2">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
