import { useTeacherCourses } from "@/api/courses/hooks";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Loader2,
  Users,
  Clock,
  BookOpen,
  AlertCircle,
  Calendar,
  GraduationCap,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import { memo } from "react";

const BatchStatusBadge = ({ status }) => {
  const statusStyles = {
    upcoming: {
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-100 dark:border-blue-400/20",
    },
    ongoing: {
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-500/10",
      border: "border-green-100 dark:border-green-400/20",
    },
    completed: {
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-50 dark:bg-gray-500/10",
      border: "border-gray-100 dark:border-gray-400/20",
    },
    enrolling: {
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      border: "border-purple-100 dark:border-purple-400/20",
    },
  };

  const style = statusStyles[status];

  return (
    <Badge
      className={cn(
        "capitalize",
        style.color,
        style.bg,
        style.border,
        "shadow-sm border backdrop-blur-sm"
      )}
    >
      {status}
    </Badge>
  );
};

BatchStatusBadge.propTypes = {
  status: PropTypes.oneOf(["upcoming", "ongoing", "completed", "enrolling"])
    .isRequired,
};

const BatchCard = memo(({ course, batch }) => {
  const getBatchScheduleStatus = () => {
    const now = new Date();
    const startDate = new Date(batch.batchStartDate);
    const endDate = new Date(batch.batchEndDate);

    if (now < startDate) {
      const daysToStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      return `Starts in ${daysToStart} days`;
    } else if (now > endDate) {
      return "Completed";
    } else {
      const progress = Math.round(
        ((now - startDate) / (endDate - startDate)) * 100
      );
      return `${progress}% completed`;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 
                 dark:border-gray-700/50 overflow-hidden hover:shadow-lg transition-all duration-200 
                 backdrop-blur-sm"
    >
      <div className="p-5 space-y-4">
        {/* Batch Status & Schedule */}
        <div className="flex justify-between items-start">
          <BatchStatusBadge status={batch.status} />
          <div className="text-sm text-muted-foreground dark:text-gray-400">
            <Calendar className="w-4 h-4 inline mr-1" />
            {getBatchScheduleStatus()}
          </div>
        </div>

        {/* Course & Batch Info */}
        <div>
          <h3
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 
                         group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            {batch.name}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            {course.title}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-200 dark:border-gray-700/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1">
              Students
            </p>
            <p className="font-medium dark:text-gray-200">
              <Users className="w-4 h-4 inline mr-1" />
              {batch.enrollmentCount}/{batch.maxStudents}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1">
              Duration
            </p>
            <p className="font-medium dark:text-gray-200">
              <Clock className="w-4 h-4 inline mr-1" />
              {course.duration}w
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1">
              Schedule
            </p>
            <p className="font-medium dark:text-gray-200">
              {batch.schedule || "Flexible"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                       group shadow-sm transition-all duration-200 hover:shadow-blue-500/25 
                       hover:shadow-lg dark:text-white flex items-center justify-center gap-2"
            asChild
          >
            <Link to={`/dashboard/batches/${batch.id}/classroom`}>
              <BookOpen className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Enter Classroom
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

BatchCard.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  batch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    enrollmentCount: PropTypes.number.isRequired,
    maxStudents: PropTypes.number.isRequired,
    batchStartDate: PropTypes.string.isRequired,
    batchEndDate: PropTypes.string.isRequired,
    schedule: PropTypes.string,
  }).isRequired,
};

export default function TeacherClasses() {
  const { data, isLoading, error } = useTeacherCourses();

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

  const groupBatchesByStatus = () => {
    const groups = {
      ongoing: [],
      upcoming: [],
      completed: [],
    };

    data?.courses.forEach((item) => {
      const status = item.batch.status;
      if (status in groups) {
        groups[status].push(item);
      }
    });

    return groups;
  };

  const batchGroups = groupBatchesByStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg border border-blue-100 dark:border-blue-500/20">
          <h3 className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Active Batches
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {batchGroups.ongoing.length}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-lg border border-purple-100 dark:border-purple-500/20">
          <h3 className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Total Students
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data?.courses.reduce(
              (sum, item) => sum + item.batch.enrollmentCount,
              0
            )}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-lg border border-green-100 dark:border-green-500/20">
          <h3 className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Completion Rate
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(
              (batchGroups.completed.length / data?.courses.length) * 100
            )}
            %
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="bg-violet-500/5 dark:bg-violet-500/10 p-1 border dark:border-violet-500/20">
          <TabsTrigger
            value="ongoing"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white
                       dark:text-gray-300 dark:data-[state=active]:bg-violet-500
                       dark:data-[state=active]:text-white dark:hover:bg-violet-500/10
                       dark:data-[state=active]:shadow-none transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Ongoing ({batchGroups.ongoing.length})
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white
                       dark:text-gray-300 dark:data-[state=active]:bg-violet-500
                       dark:data-[state=active]:text-white dark:hover:bg-violet-500/10
                       dark:data-[state=active]:shadow-none transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Upcoming ({batchGroups.upcoming.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white
                       dark:text-gray-300 dark:data-[state=active]:bg-violet-500
                       dark:data-[state=active]:text-white dark:hover:bg-violet-500/10
                       dark:data-[state=active]:shadow-none transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Completed ({batchGroups.completed.length})
          </TabsTrigger>
        </TabsList>

        {Object.entries(batchGroups).map(([status, items]) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <BatchCard
                  key={`${item.course._id}-${item.batch.id}`}
                  {...item}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Empty State */}
      {data?.courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-500/10 w-fit mx-auto">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No assigned batches
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              You haven't been assigned to any course batches yet
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
