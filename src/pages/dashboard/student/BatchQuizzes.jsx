import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  PenTool,
  Clock4,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  ArrowLeft,
  Timer,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentBatchQuizzes } from "@/api/quizzes/hooks";
import { format } from "date-fns";
import QuizDetailsDialog from "@/components/modals/QuizDetailsDialog";
import PropTypes from "prop-types";

const QuizCard = ({ quiz }) => {
  const getStatusConfig = (status) => {
    const config = {
      pending: {
        icon: Clock4,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
        borderColor: "border-blue-100 dark:border-blue-500/10",
        label: "Pending",
      },
      submitted: {
        icon: PenTool,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-500/10",
        borderColor: "border-orange-100 dark:border-orange-500/10",
        label: "Submitted",
      },
      completed: {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-500/10",
        borderColor: "border-green-100 dark:border-green-500/10",
        label: "Completed",
      },
      overdue: {
        icon: AlertCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-500/10",
        borderColor: "border-red-100 dark:border-red-500/10",
        label: "Overdue",
      },
    };
    return config[status] || config.pending;
  };

  const statusConfig = getStatusConfig(quiz.status);
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
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Timer className="w-4 h-4" />
            {quiz.duration} mins
          </div>
        </div>
        <CardTitle className="text-base font-semibold">{quiz.title}</CardTitle>
        {quiz.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {quiz.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quiz Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {format(new Date(quiz.dueDate), "MMM dd, yyyy")}
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {quiz.questions.length} Questions • {quiz.totalMarks} Marks
              </span>
            </div>
          </div>

          {/* Submission Status */}
          {quiz.submission && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Score</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {quiz.submission.score}%
                </span>
              </div>
              <Progress
                value={parseFloat(quiz.submission.score)}
                className="h-1.5"
              />
            </div>
          )}

          {/* Action Button */}
          <Button
            size="lg"
            className={cn(
              "w-full",
              quiz.status === "completed"
                ? "bg-green-500 hover:bg-green-600"
                : quiz.status === "overdue"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-violet-600 hover:bg-violet-700"
            )}
            asChild
          >
            <Link
              to={
                quiz.status === "completed" || quiz.status === "submitted"
                  ? `/dashboard/quizzes/${quiz._id}/review`
                  : `/dashboard/quizzes/${quiz._id}/attempt`
              }
            >
              {quiz.status === "pending"
                ? "Start Quiz"
                : quiz.status === "completed"
                ? "View Results"
                : quiz.status === "overdue"
                ? "Overdue"
                : "Continue Quiz"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

QuizCard.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.number.isRequired,
    dueDate: PropTypes.string.isRequired,
    totalMarks: PropTypes.number.isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        question: PropTypes.string.isRequired,
      })
    ).isRequired,
    status: PropTypes.oneOf(["pending", "submitted", "completed", "overdue"])
      .isRequired,
    submission: PropTypes.shape({
      status: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
      marks: PropTypes.number.isRequired,
      totalMarks: PropTypes.number.isRequired,
      score: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

const BatchQuizzes = () => {
  const { batchId } = useParams();
  const [view, setView] = useState("all");

  const { data, isLoading, error } = useStudentBatchQuizzes(batchId);

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

  const filteredQuizzes = data?.quizzes?.filter(
    (quiz) => view === "all" || quiz.status === view
  );

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
          <Link to="/dashboard/quizzes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Batches
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Batch Quizzes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {data?.courseName} - {data?.batchName}
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "submitted", "completed", "overdue"].map(
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

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes?.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} />
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes?.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-full bg-violet-50 dark:bg-violet-500/10 w-fit mx-auto">
              <PenTool className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No quizzes found
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              {view !== "all"
                ? "Try changing the filter"
                : "There are no quizzes in this batch yet"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchQuizzes;
