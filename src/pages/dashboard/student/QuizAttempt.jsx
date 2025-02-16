import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizAttempt, useSubmitQuiz } from "@/api/quizzes/hooks";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLayout } from "@/contexts/LayoutContext";
import {
  Timer,
  AlertCircle,
  Loader2,
  XCircle,
  Flag,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";



export default function QuizAttempt() {
  const { setShowDashboardLayout } = useLayout();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  const { data: quiz, isLoading, error } = useQuizAttempt(quizId);

  const submitQuiz = useSubmitQuiz();

  // Initialize timer
  useEffect(() => {
    if (quiz && !timeLeft) {
      setTimeLeft(quiz.duration * 60);
      // Initialize answers array with nulls
      setAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz, timeLeft]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(intervalId);
          handleSubmit();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      await submitQuiz.mutateAsync({
        quizId,
        answers,
      });

      toast({
        title: "Quiz submitted successfully",
        description: "You can now view your results",
      });

      navigate(`/dashboard/quizzes/${quizId}/review`);
    } catch (error) {
      toast({
        title: "Error submitting quiz",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const currentQuestionData = quiz.questions[currentQuestion];
  const answeredQuestions = answers.filter((a) => a !== null).length;
  const progress = (answeredQuestions / quiz.questions.length) * 100;

  const getOptionState = (questionIndex, optionIndex) => {
    // Allow selecting options only for current question
    if (questionIndex === currentQuestion) {
      if (answers[questionIndex] === optionIndex) return "selected";
      return "default";
    }
    return "neutral"; // For non-current questions
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quiz.title}
                </h2>
                {quiz.description && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {quiz.description}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Info className="w-5 h-5" />
                  <span>Total Questions: {quiz.questions.length}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Timer className="w-5 h-5" />
                  <span>Duration: {quiz.duration} minutes</span>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setShowInfo(false)}
              >
                Start Quiz
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full bg-indigo-500 dark:bg-indigo-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Quiz Header */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className="px-4 py-2 text-lg bg-white dark:bg-gray-800/90 shadow-sm backdrop-blur-sm dark:text-gray-100"
          >
            Question {currentQuestion + 1}/{quiz.questions.length}
          </Badge>
          <Badge
            variant="secondary"
            className="px-4 py-2 text-lg bg-white dark:bg-gray-800/90 shadow-sm backdrop-blur-sm dark:text-gray-100"
          >
            {answeredQuestions} Answered
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800/90 shadow-sm backdrop-blur-sm text-indigo-600 dark:text-indigo-400">
            <Timer className="w-5 h-5" />
            <span className="text-lg font-bold tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
          <Button
            variant="outline"
            className="hover:bg-red-50 dark:hover:bg-red-900/30 dark:bg-gray-800/90 dark:text-gray-100"
            onClick={() => {
              if (window.confirm("Are you sure you want to exit the quiz?")) {
                navigate(-1);
              }
            }}
          >
            <XCircle className="w-6 h-6 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="h-screen pt-20 pb-8 px-4 flex flex-col items-center justify-center"
        >
          {/* Question */}
          <motion.div
            className="w-full max-w-4xl mx-auto text-center mb-8 bg-white dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg backdrop-blur-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {currentQuestionData.question}
            </h2>
            <Badge
              variant="secondary"
              className="text-lg dark:bg-gray-700 dark:text-gray-100"
            >
              {currentQuestionData.marks} marks
            </Badge>
          </motion.div>

          {/* Options Grid */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestionData.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 },
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                className={cn(
                  "p-6 rounded-xl text-left text-lg font-medium transition-all shadow-sm",
                  "border-2",
                  {
                    "bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300":
                      getOptionState(currentQuestion, index) === "selected",
                    "bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300":
                      getOptionState(currentQuestion, index) === "correct",
                    "bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300":
                      getOptionState(currentQuestion, index) === "incorrect",
                    "bg-white dark:bg-gray-800 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 text-gray-900 dark:text-gray-100":
                      getOptionState(currentQuestion, index) === "default" ||
                      getOptionState(currentQuestion, index) === "neutral",
                  }
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      {
                        "border-indigo-500 text-indigo-600 dark:text-indigo-400":
                          getOptionState(currentQuestion, index) === "selected",
                        "border-green-500 text-green-600 dark:text-green-400":
                          getOptionState(currentQuestion, index) === "correct",
                        "border-red-500 text-red-600 dark:text-red-400":
                          getOptionState(currentQuestion, index) ===
                          "incorrect",
                        "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300":
                          getOptionState(currentQuestion, index) ===
                            "default" ||
                          getOptionState(currentQuestion, index) === "neutral",
                      }
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 dark:text-gray-100">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Question Progress Indicators */}
          <div className="fixed bottom-4 left-4 right-4">
            <div className="flex justify-center gap-2">
              {quiz.questions.map((_, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    currentQuestion === index
                      ? "bg-indigo-500"
                      : answers[index] !== null
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600",
                    // Only allow moving to next question, not previous ones
                    index === currentQuestion + 1 &&
                      answers[currentQuestion] !== null
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  )}
                  whileHover={
                    index === currentQuestion + 1 ? { scale: 1.2 } : {}
                  }
                  onClick={() => {
                    if (
                      index === currentQuestion + 1 &&
                      answers[currentQuestion] !== null
                    ) {
                      setCurrentQuestion(index);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Show a "Next" button when not on the last question */}
          {currentQuestion < quiz.questions.length - 1 &&
            answers[currentQuestion] !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Button
                  size="lg"
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="bg-[#58CC02] hover:bg-[#4CAF02] dark:bg-[#58CC02]/90 dark:hover:bg-[#4CAF02]/90 text-white px-8 py-6 text-xl rounded-full shadow-lg border-b-4 border-[#4CAF02] dark:border-[#4CAF02]/50 hover:translate-y-[1px] hover:border-b-[3px] active:translate-y-[2px] active:border-b-[2px] transition-all duration-100"
                >
                  Next Question
                </Button>
              </motion.div>
            )}

          {/* Submit button for last question */}
          {currentQuestion === quiz.questions.length - 1 &&
            answers[currentQuestion] !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitQuiz.isPending}
                  className="bg-[#1CB0F6] hover:bg-[#0095E1] dark:bg-[#1CB0F6]/90 dark:hover:bg-[#0095E1]/90 text-white px-8 py-6 text-xl rounded-full shadow-lg border-b-4 border-[#0095E1] dark:border-[#0095E1]/50 hover:translate-y-[1px] hover:border-b-[3px] active:translate-y-[2px] active:border-b-[2px] transition-all duration-100"
                >
                  {submitQuiz.isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-6 h-6 mr-2" />
                      Finish Quiz
                    </>
                  )}
                </Button>
              </motion.div>
            )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
