import { useState } from "react";
import {
  PenTool,
  Clock4,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowLeft,
  BarChart2,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAssignments,
  useBatchAssignmentStats,
  useDeleteAssignment,
} from "@/api/assignments/hooks";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { CreateAssignmentDialog } from "@/components/assignments/CreateAssignmentDialog";
import { AssignmentDetailsDialog } from "@/components/assignments/AssignmentDetailsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Move getAssignmentStatus outside of components
const getAssignmentStatus = (assignment) => {
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);

  if (dueDate > now) return "active";
  if (assignment.submissionsCount > 0) {
    // If there are submissions but not all students have submitted
    if (assignment.submissionsCount < assignment.enrollmentCount) {
      return "needs grading";
    }
    return "completed";
  }
  return "draft";
};

const AssignmentCard = ({ assignment }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const deleteAssignment = useDeleteAssignment();

  const getStatusConfig = (status) => {
    const config = {
      active: {
        icon: Clock4,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-500/10",
        borderColor: "border-green-100 dark:border-green-500/10",
      },
      "needs grading": {
        icon: AlertCircle,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-500/10",
        borderColor: "border-orange-100 dark:border-orange-500/10",
      },
      completed: {
        icon: CheckCircle2,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
        borderColor: "border-blue-100 dark:border-blue-500/10",
      },
      draft: {
        icon: PenTool,
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-500/10",
        borderColor: "border-gray-100 dark:border-gray-500/10",
      },
    };
    return config[status] || config.draft;
  };

  const status = getAssignmentStatus(assignment);
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  // Calculate submission stats using enrollment and submission counts
  const submissionPercentage =
    assignment.enrollmentCount > 0
      ? (assignment.submissionsCount / assignment.enrollmentCount) * 100
      : 0;

  // Add handleDelete function
  const handleDelete = async () => {
    try {
      await deleteAssignment.mutateAsync({
        batchId: assignment.batch,
        assignmentId: assignment._id,
      });
      toast.success("Assignment deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete assignment");
    }
  };

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200",
          "bg-white/90 dark:bg-gray-800/90",
          "hover:shadow-lg dark:hover:shadow-gray-800/30",
          "backdrop-blur-sm",
          "border-l-4",
          "border-gray-200/50 dark:border-gray-700/30",
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
              {status}
            </Badge>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {assignment.totalMarks} points
              </p>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-violet-600 -mr-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => {
                        setIsEditing(true);
                        setShowDetails(true);
                      }}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                      disabled={assignment.submissionsCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <CardTitle className="text-base font-semibold">
            {assignment.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Due Date and Submission Count */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {assignment.submissionsCount}/{assignment.enrollmentCount}
                </span>
              </div>
            </div>

            {/* Submission Progress */}
            <div className="space-y-1.5">
              <Progress
                value={submissionPercentage}
                className={cn(
                  "h-1.5 rounded-full",
                  submissionPercentage === 100 &&
                    "bg-green-100 dark:bg-green-500/20"
                )}
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Submission Progress
                </span>
                <span
                  className={cn(
                    "font-medium",
                    submissionPercentage === 100
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  {Math.round(submissionPercentage)}%
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-200/50 dark:border-gray-700/30 
                           hover:bg-violet-50 dark:hover:bg-violet-500/10"
                onClick={() => setShowDetails(true)}
              >
                View Details
              </Button>
              <Button
                size="sm"
                className={cn(
                  "w-full",
                  status === "needs grading"
                    ? "bg-orange-500 hover:bg-orange-600 dark:bg-orange-500/90 dark:hover:bg-orange-600/90"
                    : "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
                )}
                asChild
              >
                <Link
                  to={`/dashboard/batches/${assignment.batch}/assignments/${assignment._id}/submissions`}
                >
                  {status === "needs grading"
                    ? "Grade Now"
                    : "View Submissions"}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AssignmentDetailsDialog
        assignment={assignment}
        open={showDetails}
        onOpenChange={(open) => {
          setShowDetails(open);
          if (!open) setIsEditing(false);
        }}
        defaultEdit={isEditing}
      />
    </>
  );
};

AssignmentCard.propTypes = {
  assignment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    totalMarks: PropTypes.number.isRequired,
    enrollmentCount: PropTypes.number.isRequired,
    submissionsCount: PropTypes.number.isRequired,
    module: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    createdBy: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const Assignments = () => {
  const { batchId } = useParams();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const courseName = location.state?.courseName;
  const batchName = location.state?.batchName;
  const [view, setView] = useState("all");

  // Fetch assignments and stats
  const { data: assignments, isLoading: isLoadingAssignments } =
    useAssignments(batchId);
  const { data: stats, isLoading: isLoadingStats } =
    useBatchAssignmentStats(batchId);

  // Now getAssignmentStatus is accessible here
  const filteredAssignments = assignments?.filter((assignment) => {
    if (view === "all") return true;
    const status = getAssignmentStatus(assignment);
    return status === view;
  });

  // Quick stats from the API
  const quickStats = [
    {
      title: "Active",
      value: stats?.active || "0",
      icon: Clock4,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
    {
      title: "Need Grading",
      value: stats?.pendingGrading || "0",
      icon: AlertCircle,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      title: "Completed",
      value: stats?.completed || "0",
      icon: BarChart2,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
  ];

  if (isLoadingAssignments || isLoadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Batch Assignments
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {courseName} - {batchName}
            </p>
          </div>
          <CreateAssignmentDialog courseId={courseId} />
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
        {["all", "active", "needs grading", "completed", "draft"].map(
          (filter) => (
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
          )
        )}
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
              <PenTool className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No assignments found
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              {view !== "all"
                ? `No ${view} assignments found. Try changing the filter.`
                : "Create your first assignment for this batch!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
