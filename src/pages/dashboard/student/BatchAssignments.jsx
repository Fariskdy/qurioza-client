import { useState } from "react";
import {
  BookOpen,
  Clock4,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentAssignments } from "@/api/assignments/hooks";
import { format } from "date-fns";
import PropTypes from "prop-types";

const getAssignmentStatus = (assignment) => {
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);

  if (assignment.submission) {
    return "submitted";
  }

  if (dueDate > now) {
    return "pending";
  }

  return "missing";
};

const AssignmentCard = ({ assignment }) => {
  const getStatusConfig = (status) => {
    const config = {
      submitted: {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-500/10",
        borderColor: "border-green-100 dark:border-green-500/10",
        label: "Submitted",
      },
      pending: {
        icon: Clock4,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
        borderColor: "border-blue-100 dark:border-blue-500/10",
        label: "Pending",
      },
      missing: {
        icon: AlertCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-500/10",
        borderColor: "border-red-100 dark:border-red-500/10",
        label: "Missing",
      },
    };
    return config[status];
  };

  const status = getAssignmentStatus(assignment);
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        "bg-white/90 dark:bg-gray-800/90",
        "hover:shadow-lg dark:hover:shadow-gray-800/30",
        "backdrop-blur-sm",
        "border-l-4",
        statusConfig.borderColor
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-1">
          <Badge
            variant="secondary"
            className={cn("gap-1.5", statusConfig.color, statusConfig.bg)}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </Badge>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {assignment.totalMarks} points
          </p>
        </div>
        <CardTitle className="text-base font-semibold">
          {assignment.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Due Date and Module */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              Due: {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
            </div>
            <Badge variant="outline" className="font-normal">
              {assignment.module.title}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {assignment.description}
          </p>

          {/* Submission Status */}
          {assignment.submission && (
            <div className="space-y-1.5">
              <Progress
                value={100}
                className="h-1.5 rounded-full bg-green-100 dark:bg-green-500/20"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Submitted on{" "}
                  {format(
                    new Date(assignment.submission.submittedAt),
                    "MMM dd, yyyy"
                  )}
                </span>
                {assignment.submission.marks && (
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {assignment.submission.marks}/{assignment.totalMarks} marks
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            className={cn(
              "w-full",
              status === "submitted"
                ? "bg-green-600 hover:bg-green-700"
                : status === "missing"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
            asChild
          >
            <Link
              to={`assignment/${assignment._id}${
                status === "submitted" ? "" : ""
              }`}
            >
              {status === "submitted"
                ? "View Submission"
                : status === "missing"
                ? "Submit Late"
                : "Submit Assignment"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

AssignmentCard.propTypes = {
  assignment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    totalMarks: PropTypes.number.isRequired,
    module: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    submission: PropTypes.shape({
      status: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
      marks: PropTypes.number,
    }),
  }).isRequired,
};

const BatchAssignments = () => {
  const { batchId } = useParams();
  const [view, setView] = useState("all");
  const { data, isLoading, error } = useStudentAssignments(batchId);

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
        <p className="text-lg font-medium">Error loading assignments</p>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const filteredAssignments = data?.assignments.filter((assignment) => {
    if (view === "all") return true;
    return getAssignmentStatus(assignment) === view;
  });

  // Quick stats
  const stats = data?.stats || {
    total: 0,
    submitted: 0,
    pending: 0,
    graded: 0,
  };

  const quickStats = [
    {
      title: "Total",
      value: stats.total,
      icon: BookOpen,
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-50 dark:bg-gray-500/10",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock4,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
    {
      title: "Completed",
      value: stats.graded,
      icon: CheckCircle2,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
          asChild
        >
          <Link to="/dashboard/assignments">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Batches
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Batch Assignments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and submit your assignments
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30 
                       backdrop-blur-sm shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    stat.color,
                    stat.bg,
                    "border border-gray-200/50 dark:border-gray-700/30 shadow-sm backdrop-blur-sm"
                  )}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "submitted", "missing"].map((filter) => (
          <Button
            key={filter}
            variant={view === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setView(filter)}
            className={cn(
              "rounded-full border-gray-200/50 dark:border-gray-700/30",
              view === filter
                ? "bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400"
            )}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments?.map((assignment) => (
          <AssignmentCard key={assignment._id} assignment={assignment} />
        ))}
      </div>

      {/* Empty State */}
      {(!filteredAssignments || filteredAssignments.length === 0) && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-full bg-violet-50 dark:bg-violet-500/10 w-fit mx-auto">
              <BookOpen className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No assignments found
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              {view !== "all"
                ? `No ${view} assignments found. Try changing the filter.`
                : "There are no assignments in this batch yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchAssignments;
