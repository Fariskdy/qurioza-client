import { useState } from "react";
import PropTypes from "prop-types";
import {
  BrainCircuit,
  Plus,
  Trash2,
  GripVertical,
  Timer,
  Calendar,
  AlertCircle,
  Loader2,
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
import { useCreateQuiz } from "@/api/quizzes";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const QuestionCard = ({ question, index, onUpdate, onDelete, isLast }) => {
  return (
    <div
      className={cn(
        "group relative p-4 bg-white dark:bg-gray-800/90 rounded-lg border border-gray-200/50 dark:border-gray-700/30",
        "hover:shadow-md transition-all duration-200"
      )}
    >
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="space-y-4">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {index + 1}
            </Label>
            <Input
              value={question.question}
              onChange={(e) =>
                onUpdate(index, { ...question, question: e.target.value })
              }
              placeholder="Enter your question"
              className="mt-1"
            />
          </div>
          <div className="w-24">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Marks
            </Label>
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
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Options
          </Label>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onUpdate(index, { ...question, correctAnswer: optionIndex });
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
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(index)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Question
          </Button>
          {question.options.length < 4 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const newOptions = [...question.options, ""];
                onUpdate(index, { ...question, options: newOptions });
              }}
              className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          )}
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
  onDelete: PropTypes.func.isRequired,
  isLast: PropTypes.bool.isRequired,
};

const CreateQuizModal = ({ open, onOpenChange }) => {
  const { batchId } = useParams();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [dueDate, setDueDate] = useState("");
  const [questions, setQuestions] = useState([]);

  const { mutate: createQuiz, isLoading } = useCreateQuiz();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", ""],
        correctAnswer: 0,
        marks: 1,
      },
    ]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !title ||
      !description ||
      !duration ||
      !dueDate ||
      questions.length === 0
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Calculate total marks
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    const quizData = {
      batch: batchId,
      title,
      description,
      questions,
      duration,
      totalMarks,
      dueDate,
    };

    createQuiz(quizData, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Quiz created successfully",
        });
        onOpenChange(false);
        // Reset form
        setTitle("");
        setDescription("");
        setDuration(30);
        setDueDate("");
        setQuestions([]);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-500" />
            Create New Quiz
          </DialogTitle>
          <DialogDescription>
            Create a new quiz for your batch. Add questions and set the quiz
            parameters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-500" />
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="dueDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Questions
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No questions added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={index}
                    question={question}
                    index={index}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                    isLast={index === questions.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Quiz
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

CreateQuizModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};

export default CreateQuizModal;
