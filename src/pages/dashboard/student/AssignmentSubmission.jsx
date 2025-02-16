import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Upload,
  Loader2,
  AlertCircle,
  FileText,
  X,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAssignment } from "@/api/assignments/hooks";
import {
  useSubmitAssignment,
  useEditSubmission,
  useRemoveAttachment,
} from "@/api/submissions/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { assignmentKeys } from "@/api/assignments/queries";

const AssignmentSubmission = () => {
  const { batchId, assignmentId } = useParams();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: assignment,
    isLoading,
    error,
  } = useAssignment(batchId, assignmentId);

  const submitAssignment = useSubmitAssignment();
  const editSubmission = useEditSubmission();
  const removeAttachment = useRemoveAttachment();
  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Add file size and type validation here
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    files.forEach((file) => {
      formData.append("files", file);
    });

    submitAssignment.mutate(
      {
        batchId,
        assignmentId,
        submission: formData,
      },
      {
        onSuccess: () => {
          setContent("");
          setFiles([]);
          queryClient.invalidateQueries(
            assignmentKeys.detail(batchId, assignmentId)
          );
        },
      }
    );
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    files.forEach((file) => {
      formData.append("files", file);
    });

    editSubmission.mutate(
      {
        assignmentId,
        batchId,
        submission: formData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setContent("");
          setFiles([]);
        },
      }
    );
  };

  const handleRemoveAttachment = async (attachmentId, e) => {
    // Prevent event bubbling to form submission
    e.preventDefault();
    e.stopPropagation();

    try {
      await removeAttachment.mutate(
        {
          assignmentId,
          attachmentId,
          batchId,
        },
        {
          onSuccess: () => {
            // Don't need to do anything here as the hook will handle query invalidation
          },
        }
      );
    } catch (error) {
      console.error("Error removing attachment:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFiles([]);
    setContent(assignment?.submission?.content || "");
  };

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
        <p className="text-lg font-medium">Error loading assignment</p>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const isLateSubmission = new Date() > new Date(assignment?.dueDate);
  const hasSubmission = !!assignment?.submission;

  const isSubmissionEditable = (assignment) => {
    if (!assignment?.submission) return false;
    if (assignment.submission.status === "graded") return false;
    return new Date() <= new Date(assignment.dueDate);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
          asChild
        >
          <Link to={`/dashboard/assignments/batch/${batchId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Link>
        </Button>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {assignment?.title}
            </h1>
            <Badge
              variant="secondary"
              className={cn(
                "capitalize",
                isLateSubmission
                  ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
              )}
            >
              {isLateSubmission ? "Late Submission" : "On Time"}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due: {format(new Date(assignment?.dueDate), "MMM dd, yyyy")}
            </div>
            <Badge variant="outline" className="font-normal">
              {assignment?.module.title}
            </Badge>
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Instructions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">
              {assignment?.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            Total Marks: {assignment?.totalMarks}
          </div>
        </CardContent>
      </Card>

      {/* Submission Section */}
      {hasSubmission && !isEditing ? (
        // View Submission Mode
        <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Your Submission
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      assignment.submission.status === "graded"
                        ? "bg-green-50 text-green-600"
                        : "bg-blue-50 text-blue-600"
                    }
                  >
                    {assignment.submission.status === "graded"
                      ? "Graded"
                      : "Submitted"}
                  </Badge>
                  {isSubmissionEditable(assignment) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setContent(assignment.submission.content);
                        setFiles([]);
                        setIsEditing(true);
                      }}
                    >
                      Edit Submission
                    </Button>
                  )}
                </div>
              </div>

              {/* Submission Content */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {assignment.submission.content}
                </p>
              </div>

              {/* Attachments */}
              {assignment.submission.attachments?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Attachments
                  </h4>
                  <div className="space-y-2">
                    {assignment.submission.attachments.map((file) => (
                      <div
                        key={file._id}
                        className="flex items-center justify-between p-2 rounded-lg border border-gray-200/50 dark:border-gray-700/30"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {file.filename}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grades and Feedback if graded */}
              {assignment.submission.status === "graded" && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Marks Obtained
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {assignment.submission.marks}/{assignment.totalMarks}
                    </span>
                  </div>
                  {assignment.submission.feedback && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Feedback
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {assignment.submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Submission Form Mode
        <form
          onSubmit={isEditing ? handleEdit : handleSubmit}
          className="space-y-6"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30">
            <CardContent className="p-6 space-y-6">
              {/* Content Section */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Your Submission
                </h3>
                <Textarea
                  placeholder="Write your submission here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    className="gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Upload className="w-4 h-4" />
                    Add Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Maximum 5 files, 10MB each
                  </p>
                </div>

                {/* Existing Attachments in Edit Mode */}
                {isEditing && assignment.submission.attachments?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Existing Attachments
                    </h4>
                    <div className="space-y-2">
                      {assignment.submission.attachments.map((file) => (
                        <div
                          key={file._id}
                          className="flex items-center justify-between p-2 rounded-lg border border-gray-200/50 dark:border-gray-700/30 bg-gray-50 dark:bg-gray-900/50"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {file.filename}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
                              asChild
                            >
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                              onClick={(e) =>
                                handleRemoveAttachment(file._id, e)
                              }
                              disabled={removeAttachment.isPending}
                            >
                              {removeAttachment.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Files List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      New Files to Upload
                    </h4>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg border border-gray-200/50 dark:border-gray-700/30 bg-gray-50 dark:bg-gray-900/50"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700"
              disabled={
                submitAssignment.isPending ||
                editSubmission.isPending ||
                (!content && files.length === 0)
              }
            >
              {(submitAssignment.isPending || editSubmission.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {isEditing
                ? "Update Submission"
                : isLateSubmission
                ? "Submit Late"
                : "Submit Assignment"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AssignmentSubmission;
