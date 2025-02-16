import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  BrainCircuit,
  Timer,
  Calendar,
  AlertCircle,
  Loader2,
  Save,
  Edit2,
  X,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQuiz, useUpdateQuiz } from "@/api/quizzes";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const QuestionCard = ({
  question,
  index,
  onUpdate,
  isEditing,
  onDelete,
  onAddOption,
  onRemoveOption,
  canModifyOptions,
}) => {
  return (
    <div
      className={cn(
        "group relative p-4 bg-white dark:bg-gray-800/90 rounded-lg border border-gray-200/50 dark:border-gray-700/30",
        "hover:shadow-md transition-all duration-200"
      )}
    >
      {/* Delete Question Button */}
      {isEditing && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="absolute -right-2 -top-2 h-8 w-8 p-0 text-red-500 hover:text-red-600"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="space-y-4">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {index + 1}
            </Label>
            {isEditing ? (
              <Input
                value={question.question}
                onChange={(e) =>
                  onUpdate(index, { ...question, question: e.target.value })
                }
                placeholder="Enter your question"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                {question.question}
              </p>
            )}
          </div>
          <div className="w-24">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Marks
            </Label>
            {isEditing ? (
              <Input
                type="number"
                min="1"
                value={question.marks}
                onChange={(e) =>
                  onUpdate(index, {
                    ...question,
                    marks: parseInt(e.target.value),
                  })
                }
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-center font-medium text-gray-600 dark:text-gray-300">
                {question.marks}
              </p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Options
            </Label>
            {isEditing && canModifyOptions && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddOption}
                className="h-6 px-2"
                disabled={question.options.length >= 6}
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[optionIndex] = e.target.value;
                      onUpdate(index, { ...question, options: newOptions });
                    }}
                    placeholder={`Option ${optionIndex + 1}`}
                    className={cn(
                      optionIndex === question.correctAnswer &&
                        "border-green-500 dark:border-green-400 focus-visible:ring-green-500"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onUpdate(index, {
                          ...question,
                          correctAnswer: optionIndex,
                        });
                      }}
                      className={cn(
                        "min-w-[100px]",
                        optionIndex === question.correctAnswer
                          ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                          : "text-gray-500"
                      )}
                    >
                      {optionIndex === question.correctAnswer
                        ? "Correct"
                        : "Mark Correct"}
                    </Button>
                  </div>
                  {canModifyOptions && question.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveOption(optionIndex)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </>
              ) : (
                <p
                  className={cn(
                    "flex-1 p-2 rounded-md",
                    optionIndex === question.correctAnswer
                      ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300"
                      : "bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300"
                  )}
                >
                  {option}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctAnswer: PropTypes.number.isRequired,
    marks: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  onAddOption: PropTypes.func,
  onRemoveOption: PropTypes.func,
  canModifyOptions: PropTypes.bool,
};

const QuizDetailsDialog = ({ open, onOpenChange, quizId }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuiz, setEditedQuiz] = useState(null);

  const { data: quiz, isLoading } = useQuiz(quizId, { includeStats: true });
  const { mutate: updateQuiz, isLoading: isUpdating } = useUpdateQuiz();

  const canEditQuestions =
    !quiz?.submissionStats || quiz.submissionStats.total === 0;

  const addNewQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", ""],
      correctAnswer: 0,
      marks: 1,
    };
    setEditedQuiz({
      ...editedQuiz,
      questions: [...editedQuiz.questions, newQuestion],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = editedQuiz.questions.filter((_, i) => i !== index);
    setEditedQuiz({
      ...editedQuiz,
      questions: newQuestions,
    });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...editedQuiz.questions];
    newQuestions[questionIndex].options.push("");
    setEditedQuiz({
      ...editedQuiz,
      questions: newQuestions,
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...editedQuiz.questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);

    // If removing the correct answer, set it to the first option
    if (optionIndex === newQuestions[questionIndex].correctAnswer) {
      newQuestions[questionIndex].correctAnswer = 0;
    }
    // If removing an option before the correct answer, adjust the correct answer index
    else if (optionIndex < newQuestions[questionIndex].correctAnswer) {
      newQuestions[questionIndex].correctAnswer--;
    }

    setEditedQuiz({
      ...editedQuiz,
      questions: newQuestions,
    });
  };

  useEffect(() => {
    if (quiz) {
      setEditedQuiz(quiz);
    }
  }, [quiz]);

  const handleUpdate = () => {
    updateQuiz(
      { quizId, ...editedQuiz },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Quiz updated successfully",
          });
          setIsEditing(false);
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
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...editedQuiz.questions];
    newQuestions[index] = updatedQuestion;
    setEditedQuiz({ ...editedQuiz, questions: newQuestions });
  };

  if (isLoading || !editedQuiz) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              Quiz Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedQuiz(quiz);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Quiz
                </Button>
              )}
            </div>
          </div>
          <DialogDescription>
            View and manage quiz details and questions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quiz Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Quiz Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={editedQuiz.title}
                  onChange={(e) =>
                    setEditedQuiz({ ...editedQuiz, title: e.target.value })
                  }
                  placeholder="Enter quiz title"
                />
              ) : (
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {editedQuiz.title}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editedQuiz.description}
                  onChange={(e) =>
                    setEditedQuiz({
                      ...editedQuiz,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter quiz description"
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {editedQuiz.description}
                </p>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-500" />
                Duration
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  value={editedQuiz.duration}
                  onChange={(e) =>
                    setEditedQuiz({
                      ...editedQuiz,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              ) : (
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {editedQuiz.duration} minutes
                </p>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Due Date
              </Label>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={format(
                    new Date(editedQuiz.dueDate),
                    "yyyy-MM-dd'T'HH:mm"
                  )}
                  onChange={(e) =>
                    setEditedQuiz({ ...editedQuiz, dueDate: e.target.value })
                  }
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                />
              ) : (
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {format(new Date(editedQuiz.dueDate), "PPP p")}
                </p>
              )}
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Questions
              </h3>
              {isEditing && canEditQuestions && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewQuestion}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              )}
            </div>
            {!canEditQuestions && isEditing && (
              <div className="flex items-center gap-2 p-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 rounded-md">
                <AlertCircle className="w-4 h-4" />
                Cannot modify questions as quiz has submissions
              </div>
            )}
            <div className="space-y-4">
              {editedQuiz.questions.map((question, index) => (
                <QuestionCard
                  key={index}
                  question={question}
                  index={index}
                  onUpdate={updateQuestion}
                  isEditing={isEditing}
                  onDelete={
                    canEditQuestions ? () => removeQuestion(index) : undefined
                  }
                  onAddOption={
                    canEditQuestions ? () => addOption(index) : undefined
                  }
                  onRemoveOption={
                    canEditQuestions
                      ? (optionIndex) => removeOption(index, optionIndex)
                      : undefined
                  }
                  canModifyOptions={canEditQuestions}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

QuizDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  quizId: PropTypes.string.isRequired,
};

export default QuizDetailsDialog;
