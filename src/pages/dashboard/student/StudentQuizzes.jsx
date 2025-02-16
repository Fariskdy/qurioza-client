import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PenTool,
  Search,
  School,
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
import { useStudentQuizStats } from "@/api/quizzes/hooks";
import PropTypes from "prop-types";

const BatchQuizCard = ({ batch }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200/50 
                 dark:border-gray-700/30 overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div className="p-5 space-y-4">
        {/* Batch and Course Info */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <School className="w-4 h-4 text-violet-500" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {batch.batchName}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {batch.course.title}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "capitalize",
              batch.pendingQuizzes > 0
                ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
            )}
          >
            {batch.pendingQuizzes > 0 ? "Active" : "Completed"}
          </Badge>
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-100 dark:border-gray-700/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {batch.totalQuizzes || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {batch.completedQuizzes || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Completed
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {batch.averageScore?.toFixed(1) || 0}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Avg. Score
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="gap-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 
                       dark:text-violet-400 dark:hover:bg-violet-500/10"
            asChild
          >
            <Link to={`/dashboard/quizzes/batch/${batch.batchId}`}>
              View Quizzes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

BatchQuizCard.propTypes = {
  batch: PropTypes.shape({
    batchId: PropTypes.string.isRequired,
    batchName: PropTypes.string.isRequired,
    batchStatus: PropTypes.string.isRequired,
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }).isRequired,
    totalQuizzes: PropTypes.number.isRequired,
    completedQuizzes: PropTypes.number.isRequired,
    pendingQuizzes: PropTypes.number.isRequired,
    averageScore: PropTypes.number,
    upcomingQuizzes: PropTypes.number.isRequired,
    overdueQuizzes: PropTypes.number.isRequired,
  }).isRequired,
};

const StudentQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, error } = useStudentQuizStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Error loading quizzes</p>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const filteredBatches = data?.batchStats.filter((batch) => {
    const matchesSearch = batch.batchName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && batch.pendingQuizzes > 0) ||
      (statusFilter === "completed" && batch.pendingQuizzes === 0);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Quizzes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View quizzes from your ongoing and completed courses
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches?.map((batch) => (
          <BatchQuizCard key={batch.batchId} batch={batch} />
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
              No quizzes found
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "You don't have any quizzes in your enrolled courses"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentQuizzes;
