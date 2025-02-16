import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PenTool,
  Users,
  ChevronDown,
  Search,
  Plus,
  School,
  Calendar,
  Clock,
  Filter,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTeacherCourses } from "@/api/courses/hooks";
import PropTypes from "prop-types";
import { useBatchAssignmentStats } from "@/api/assignments/hooks";

const BatchAssignmentCard = ({ batch, course }) => {
  const { data: stats, isLoading: isLoadingStats } = useBatchAssignmentStats(
    batch.id
  );

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200/50 
                 dark:border-gray-700/30 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="p-5 space-y-4">
        {/* Batch Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <School className="w-4 h-4 text-violet-500" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {batch.name}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {course.title}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "capitalize",
              batch.status === "ongoing"
                ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            )}
          >
            {batch.status}
          </Badge>
        </div>

        {/* Assignment Stats */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-100 dark:border-gray-700/50">
          {isLoadingStats ? (
            <div className="col-span-3 flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.active || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.pendingGrading || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Need Grading
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats?.completed || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Completed
                </p>
              </div>
            </>
          )}
        </div>

        {/* Schedule & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{batch.schedule || "Flexible Schedule"}</span>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 
                       dark:text-violet-400 dark:hover:bg-violet-500/10"
            asChild
          >
            <Link
              to={`/dashboard/batches/${batch.id}/assignments`}
              state={{
                courseId: course._id,
                courseName: course.title,
                batchName: batch.name,
              }}
            >
              View Assignments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

BatchAssignmentCard.propTypes = {
  batch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    schedule: PropTypes.string,
  }).isRequired,
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

const TeacherAssignments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: coursesData, isLoading, error } = useTeacherCourses();

  // Add loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // Add error state
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

  const filteredBatches = coursesData?.courses.filter((item) => {
    const matchesSearch =
      item.batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Assignments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage assignments across all your batches
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30 
                       text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="w-[180px] bg-white dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30 
                         text-gray-900 dark:text-gray-100"
          >
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30">
            <SelectItem value="all">All Batches</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches?.map((item) => (
          <BatchAssignmentCard
            key={`${item.course._id}-${item.batch.id}`}
            batch={item.batch}
            course={item.course}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBatches?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-full bg-violet-50 dark:bg-violet-500/10 w-fit mx-auto">
              <PenTool className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No batches found
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "You haven't been assigned to any batches yet"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherAssignments;
