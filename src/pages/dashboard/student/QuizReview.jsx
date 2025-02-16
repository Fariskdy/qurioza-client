import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizReview } from "@/api/quizzes/hooks";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PropTypes from "prop-types";

const QuestionCard = ({ question, index }) => {
  return (
    <Card className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Question {index + 1}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {question.marks} marks
          </p>
        </div>
        <Badge
          variant={question.isCorrect ? "success" : "destructive"}
          className={cn("text-sm", {
            "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300":
              question.isCorrect,
            "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300":
              !question.isCorrect,
          })}
        >
          {question.isCorrect ? "Correct" : "Incorrect"}
        </Badge>
      </div>

      <p className="text-xl text-gray-900 dark:text-gray-100">
        {question.question}
      </p>

      <div className="space-y-3">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.correctAnswer;
          const isUserAnswer = optionIndex === question.userAnswer;

          return (
            <div
              key={optionIndex}
              className={cn(
                "p-4 rounded-lg border-2 transition-colors",
                isCorrect
                  ? "border-green-500 bg-green-50/80 dark:bg-green-900/20 text-green-900 dark:text-green-100"
                  : isUserAnswer && !isCorrect
                  ? "border-red-500 bg-red-50/80 dark:bg-red-900/20 text-red-900 dark:text-red-100"
                  : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium",
                    isCorrect
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : isUserAnswer && !isCorrect
                      ? "border-red-500 text-red-600 dark:text-red-400"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </div>
                <span className="flex-1">{option}</span>
                {isCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                )}
                {isUserAnswer && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.string.isRequired,
    marks: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctAnswer: PropTypes.number.isRequired,
    userAnswer: PropTypes.number,
    isCorrect: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default function QuizReview() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { setShowDashboardLayout } = useLayout();

  const { data: review, isLoading, error } = useQuizReview(quizId);

  // Hide dashboard layout
  useEffect(() => {
    setShowDashboardLayout(false);
    return () => setShowDashboardLayout(true);
  }, [setShowDashboardLayout]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">{error.message}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const correctAnswers = review.questions.filter((q) => q.isCorrect).length;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {review.quiz.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100"
            >
              Score: {review.submission.marks}/{review.submission.totalMarks} (
              {review.submission.score}%)
            </Badge>
            <Badge
              variant="outline"
              className="text-sm text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              Submitted on{" "}
              {new Date(review.submission.submittedAt).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-24 max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Questions */}
          <div className="col-span-8 space-y-6">
            {review.questions.map((question, index) => (
              <QuestionCard key={index} question={question} index={index} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            <Card className="p-6 sticky top-24 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <h3 className="font-medium mb-6 text-gray-900 dark:text-gray-100">
                Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Questions
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {review.questions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Correct Answers
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {correctAnswers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Incorrect Answers
                  </span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {review.questions.length - correctAnswers}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Score
                    </span>
                    <span className="font-medium text-xl text-gray-900 dark:text-gray-100">
                      {review.submission.marks}/{review.submission.totalMarks}
                    </span>
                  </div>
                  <Progress
                    value={parseFloat(review.submission.score)}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
