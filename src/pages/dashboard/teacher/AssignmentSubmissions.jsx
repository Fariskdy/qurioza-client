import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import {
  useAssignmentSubmissions,
  useGradeSubmission,
} from "@/api/submissions";
import { useAssignmentDetails } from "@/api/assignments";
import { Loader } from "@/components/ui/loader";

// Add this component for the grade/regrade button
const GradeButton = ({ submission, assignment, onGrade, isGrading }) => {
  const [marks, setMarks] = useState(submission.marks || "");
  const [isOpen, setIsOpen] = useState(false);

  const validateMarks = (value, totalMarks) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return false;
    if (numValue < 0) return false;
    if (numValue > totalMarks) return false;
    return true;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className="gap-2"
          variant={submission.status === "graded" ? "outline" : "default"}
        >
          <CheckCircle2 className="w-4 h-4" />
          {submission.status === "graded" ? "Re-grade" : "Grade Submission"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onGrade(submission._id, marks);
            setIsOpen(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label
              htmlFor={`marks-${submission._id}`}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Enter Marks (out of {assignment.totalMarks})
              {submission.status === "graded" && (
                <span className="ml-2 text-gray-500">
                  (Current: {submission.marks})
                </span>
              )}
            </Label>
            <div className="flex gap-2">
              <Input
                id={`marks-${submission._id}`}
                type="number"
                min="0"
                max={assignment.totalMarks}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="flex-1"
                placeholder="Enter marks..."
              />
              <Button
                type="submit"
                size="sm"
                disabled={
                  isGrading ||
                  !marks ||
                  !validateMarks(marks, assignment.totalMarks)
                }
              >
                {isGrading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {submission.status === "graded"
                      ? "Updating..."
                      : "Grading..."}
                  </>
                ) : submission.status === "graded" ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
          {marks && !validateMarks(marks, assignment.totalMarks) && (
            <p className="text-sm text-red-500">
              {Number(marks) > assignment.totalMarks
                ? `Marks cannot exceed ${assignment.totalMarks}`
                : Number(marks) < 0
                ? "Marks cannot be negative"
                : "Invalid marks"}
            </p>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};

const AssignmentSubmissions = () => {
  const { assignmentId, batchId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [marks, setMarks] = useState({});

  console.log("assignmentId", assignmentId);
  const {
    data: assignment,
    isLoading: assignmentLoading,
    error: assignmentError,
  } = useAssignmentDetails(batchId, assignmentId);

  console.log("assignment", assignment);

  const {
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
  } = useAssignmentSubmissions(assignmentId, "all");

  const { mutate: gradeSubmission, isLoading: isGrading } =
    useGradeSubmission();

  const handleGradeSubmit = async (submissionId, marks) => {
    try {
      await gradeSubmission({
        submissionId,
        marks: Number(marks),
        feedback: "",
      });

      setMarks((prev) => ({
        ...prev,
        [submissionId]: "",
      }));

      toast({
        title: "Success",
        description: "Submission graded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to grade submission",
        variant: "destructive",
      });
    }
  };

  const validateMarks = (value, totalMarks) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return false;
    if (numValue < 0) return false;
    if (numValue > totalMarks) return false;
    return true;
  };

  if (assignmentLoading || submissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  if (assignmentError || submissionsError) {
    return (
      <div className="text-center py-16 text-red-500">
        Error:{" "}
        {assignmentError?.message ||
          submissionsError?.message ||
          "Something went wrong"}
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Assignment not found
        </h2>
      </div>
    );
  }

  const filteredSubmissions =
    submissions?.filter((submission) =>
      submission.student.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) ?? [];

  // Add color variants for submission status
  const getStatusConfig = (status) => {
    const config = {
      submitted: {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
      },
      graded: {
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-500/10",
      },
      late: {
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-500/10",
      },
    };
    return config[status] || { color: "text-gray-600", bg: "bg-gray-50" };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
          asChild
        >
          <Link to={`/dashboard/batches/${batchId}/assignments`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Link>
        </Button>

        {/* Assignment Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden">
          {/* Gradient Banner */}
          <div className="h-2 bg-gradient-to-r from-violet-500 to-violet-600 dark:from-violet-600 dark:to-violet-700" />

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title and Description */}
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {assignment.title}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {assignment.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Submissions Stat */}
              <div className="bg-violet-50 dark:bg-violet-500/10 rounded-lg p-3 flex items-center gap-3">
                <div className="p-1.5 bg-violet-100 dark:bg-violet-500/20 rounded-md">
                  <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total Submissions
                  </p>
                  <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">
                    {submissions?.length || 0}
                  </p>
                </div>
              </div>

              {/* Due Date Stat */}
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-3 flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-md">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Due Date
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {format(new Date(assignment.dueDate), "MMM dd")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(assignment.dueDate), "yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Points Stat */}
              <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-3 flex items-center gap-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-500/20 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total Points
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {assignment.totalMarks}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters with gradient background */}
      <div
        className="flex flex-col sm:flex-row gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 
                      p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/30"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 
                       placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            <SelectItem value="all">All Submissions</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <Accordion type="single" collapsible className="space-y-4">
        {filteredSubmissions.map((submission) => {
          const statusConfig = getStatusConfig(submission.status);
          return (
            <AccordionItem
              key={submission._id}
              value={submission._id}
              className="border-none"
            >
              <Card className="dark:bg-gray-800/90 hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                  <AccordionTrigger
                    className={cn(
                      "px-6 py-4 hover:no-underline",
                      "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      "data-[state=open]:bg-violet-50 dark:data-[state=open]:bg-violet-500/10",
                      "data-[state=open]:border-b data-[state=open]:border-gray-100 dark:data-[state=open]:border-gray-700",
                      "transition-all duration-200"
                    )}
                  >
                    <div className="flex items-start justify-between w-full pr-8">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {submission.student.username}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "capitalize",
                              statusConfig.bg,
                              statusConfig.color,
                              "font-medium"
                            )}
                          >
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Submitted{" "}
                          {format(
                            new Date(submission.submittedAt),
                            "MMM dd, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                      {submission.status === "graded" && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Marks
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            <span
                              className={
                                submission.marks >= assignment.totalMarks * 0.4
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {submission.marks}
                            </span>
                            /{assignment.totalMarks}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="px-6 py-6 space-y-6 bg-white dark:bg-gray-800/50">
                      {/* Submission Content */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          Submission Content
                          {submission.content && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              ({submission.content.length} characters)
                            </span>
                          )}
                        </h4>
                        <div
                          className={cn(
                            "rounded-lg p-4 border border-gray-200/50 dark:border-gray-600/30",
                            "bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30",
                            !submission.content && "italic"
                          )}
                        >
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {submission.content ||
                              "No written content provided."}
                          </p>
                        </div>
                      </div>

                      {/* Attachments */}
                      {submission.attachments?.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            Attachments
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              ({submission.attachments.length} files)
                            </span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {submission.attachments.map((attachment, index) => (
                              <a
                                key={index}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
                                  "text-sm bg-gray-50 dark:bg-gray-700/50",
                                  "text-gray-600 dark:text-gray-300",
                                  "hover:bg-gray-100 dark:hover:bg-gray-600/50",
                                  "border border-gray-200/50 dark:border-gray-600/30",
                                  "transition-colors"
                                )}
                              >
                                <Download className="w-4 h-4" />
                                {attachment.filename}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grade/Regrade Button */}
                      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                        <GradeButton
                          submission={submission}
                          assignment={assignment}
                          onGrade={handleGradeSubmit}
                          isGrading={isGrading}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </CardContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-full bg-violet-50 dark:bg-violet-500/10 w-fit mx-auto">
              <XCircle className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No submissions found
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No students have submitted this assignment yet"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
