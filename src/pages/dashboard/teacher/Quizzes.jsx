import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Clock4,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  ArrowLeft,
  Timer,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBatchQuizzes, useDeleteQuiz } from "@/api/quizzes";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import CreateQuizModal from "@/components/modals/CreateQuizModal";
import QuizDetailsDialog from "@/components/modals/QuizDetailsDialog";

const QuizCard = ({ quiz }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: deleteQuiz, isLoading: isDeleting } = useDeleteQuiz();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      deleteQuiz(
        { quizId: quiz._id, batchId: quiz.batch },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Quiz deleted successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      active: {
        icon: Clock4,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-500/10",
        borderColor: "border-green-100 dark:border-green-500/10",
      },
      "needs review": {
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
        icon: BrainCircuit,
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-500/10",
        borderColor: "border-gray-100 dark:border-gray-500/10",
      },
    };
    return config[status] || config.draft;
  };

  // Calculate quiz status based on due date and submissions
  const getQuizStatus = (quiz) => {
    const now = new Date();
    const dueDate = new Date(quiz.dueDate);

    if (dueDate < now) {
      return quiz.submissionStats.pending > 0 ? "needs review" : "completed";
    }
    return "active";
  };

  const status = getQuizStatus(quiz);
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Timer className="w-4 h-4" />
              {quiz.duration} mins
            </div>
            {quiz.submissionStats.total === 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-base font-semibold">{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Due Date and Question Count */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {format(new Date(quiz.dueDate), "MMM dd, yyyy")}
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {quiz.questions.length} Questions
              </span>
            </div>
          </div>

          {/* Submission Progress */}
          <div className="space-y-1.5">
            <Progress
              value={quiz.submissionStats.submissionPercentage}
              className={cn(
                "h-1.5 rounded-full",
                quiz.submissionStats.submissionPercentage === 100 &&
                  "bg-green-100 dark:bg-green-500/20"
              )}
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Submissions ({quiz.submissionStats.total}/
                {quiz.submissionStats.enrollmentCount})
              </span>
              <span
                className={cn(
                  "font-medium",
                  quiz.submissionStats.submissionPercentage === 100
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                {quiz.submissionStats.submissionPercentage}%
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-200/50 dark:border-gray-700/30 
                         hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
              onClick={() => setDetailsOpen(true)}
            >
              View Details
            </Button>
            <Button
              size="sm"
              className={cn(
                "w-full",
                status === "needs review"
                  ? "bg-orange-500 hover:bg-orange-600 dark:bg-orange-500/90 dark:hover:bg-orange-600/90"
                  : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              )}
              asChild
            >
              <Link to={`/dashboard/quizzes/${quiz._id}/submissions`}>
                {status === "needs review" ? "Review Now" : "View Results"}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
      <QuizDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        quizId={quiz._id}
      />
    </Card>
  );
};

QuizCard.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    dueDate: PropTypes.string.isRequired,
    questions: PropTypes.array.isRequired,
    submissionStats: PropTypes.shape({
      total: PropTypes.number.isRequired,
      graded: PropTypes.number.isRequired,
      pending: PropTypes.number.isRequired,
      submissionPercentage: PropTypes.number.isRequired,
      enrollmentCount: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

const Quizzes = () => {
  const { batchId } = useParams();
  const location = useLocation();
  const { batchName, courseName } = location.state || {
    batchName: "Loading...",
    courseName: "Loading...",
  };
  const [view, setView] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: quizzes, isLoading, error } = useBatchQuizzes(batchId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AlertCircle className="h-8 w-8 animate-spin text-indigo-600" />
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

  const filteredQuizzes = quizzes?.filter((quiz) => {
    // Calculate status based on due date and submissions
    let status = "active";
    const now = new Date();
    const dueDate = new Date(quiz.dueDate);

    if (dueDate < now) {
      status = quiz.submissionStats.pending > 0 ? "needs review" : "completed";
    }

    return view === "all" || view === status;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          asChild
        >
          <Link to="/dashboard/quizzes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Batches
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Batch Quizzes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {courseName} - {batchName}
            </p>
          </div>
          <Button
            className="gap-2"
            size="lg"
            onClick={() => setCreateModalOpen(true)}
          >
            <BrainCircuit className="w-4 h-4" />
            Create Quiz
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {["All", "Active", "Needs Review", "Completed", "Draft"].map(
          (filter) => (
            <Button
              key={filter}
              variant={view === filter.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setView(filter.toLowerCase())}
              className={cn(
                "rounded-full border-gray-200/50 dark:border-gray-700/30",
                view === filter.toLowerCase()
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
              )}
            >
              {filter}
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
            <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-500/10 w-fit mx-auto">
              <BrainCircuit className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No quizzes found
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              {view !== "all"
                ? "Try changing the filter"
                : "Create your first quiz for this batch"}
            </p>
          </div>
        </div>
      )}

      <CreateQuizModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};

export default Quizzes;
