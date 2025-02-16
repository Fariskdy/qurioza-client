import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Users,
  ChevronDown,
  Search,
  School,
  Calendar,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Timer,
  FileCheck,
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
import { useTeacherQuizStats } from "@/api/quizzes";
import PropTypes from "prop-types";

const BatchQuizCard = ({ batch, course, quizStats }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="group relative bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200/50 
               dark:border-gray-700/30 overflow-hidden hover:shadow-lg transition-all duration-200 
               backdrop-blur-sm"
  >
    <div className="p-5 space-y-4">
      {/* Batch Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <School className="w-4 h-4 text-indigo-500" />
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

      {/* Quiz Stats */}
      <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-100 dark:border-gray-700/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {quizStats.active}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {quizStats.pending}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need Review
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {quizStats.avgScore}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Score</p>
        </div>
      </div>

      {/* Schedule & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Timer className="w-4 h-4" />
          <span>{quizStats.totalQuizzes} Quizzes</span>
        </div>
        <Button
          variant="ghost"
          className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 
                     dark:text-indigo-400 dark:hover:bg-indigo-500/10"
          asChild
        >
          <Link
            to={`/dashboard/batches/${batch.id}/quizzes`}
            state={{ batchName: batch.name, courseName: course.title }}
          >
            View Quizzes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  </motion.div>
);

BatchQuizCard.propTypes = {
  batch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  quizStats: PropTypes.shape({
    active: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    avgScore: PropTypes.number.isRequired,
    totalQuizzes: PropTypes.number.isRequired,
  }).isRequired,
};

const TeacherQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useTeacherCourses();
  const {
    data: quizStats,
    isLoading: statsLoading,
    error: statsError,
  } = useTeacherQuizStats();

  const isLoading = coursesLoading || statsLoading;
  const error = coursesError || statsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Error loading data</p>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Process quiz stats for each batch
  const getBatchStats = (batchId) => {
    const batchStat = quizStats?.batchStats.find(
      (stat) => stat.batchId === batchId
    );
    if (!batchStat) {
      return {
        active: 0,
        pending: 0,
        avgScore: 0,
        totalQuizzes: 0,
      };
    }

    return {
      active: batchStat.activeQuizzes,
      pending: batchStat.completedQuizzes, // Using completed as "need review"
      avgScore: Math.round(batchStat.averageScore), // Round to whole number
      totalQuizzes: batchStat.totalQuizzes,
    };
  };

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
            Quizzes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage quizzes across all your batches
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
          <BatchQuizCard
            key={`${item.course._id}-${item.batch.id}`}
            batch={item.batch}
            course={item.course}
            quizStats={getBatchStats(item.batch.id)}
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
            <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-500/10 w-fit mx-auto">
              <BrainCircuit className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
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

export default TeacherQuizzes;
