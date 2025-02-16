import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submissionKeys } from "./queries";
import {
  getSubmission,
  getStudentSubmissions,
  getAssignmentSubmissions,
  getQuizSubmissions,
} from "./queries";
import {
  submitAssignment,
  submitQuiz,
  editSubmission,
  removeAttachment,
} from "./mutations";
import { toast } from "@/hooks/use-toast";
import { assignmentKeys } from "../assignments/queries";
import { api } from "../axios";

export const useSubmission = (submissionId) => {
  return useQuery({
    queryKey: submissionKeys.detail(submissionId),
    queryFn: () => getSubmission(submissionId),
    enabled: !!submissionId,
  });
};

export const useStudentSubmissions = (batchId) => {
  return useQuery({
    queryKey: submissionKeys.student(batchId),
    queryFn: () => getStudentSubmissions(batchId),
    enabled: !!batchId,
  });
};

export const useAssignmentSubmissions = (assignmentId, type) => {
  return useQuery({
    queryKey: submissionKeys.list(assignmentId, type),
    queryFn: () => getAssignmentSubmissions({ assignmentId, type }),
    enabled: !!assignmentId && !!type,
  });
};

export const useQuizSubmissions = (quizId, type) => {
  return useQuery({
    queryKey: submissionKeys.quiz(quizId, type),
    queryFn: () => getQuizSubmissions({ quizId, type }),
    enabled: !!quizId && !!type,
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAssignment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(submissionKeys.student(variables.batchId));
      queryClient.invalidateQueries(["assignments"]);
      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to submit assignment",
        variant: "destructive",
      });
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQuiz,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(submissionKeys.student(variables.batchId));
      queryClient.invalidateQueries(["quizzes"]);
      toast({
        title: "Success",
        description: "Quiz submitted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit quiz",
        variant: "destructive",
      });
    },
  });
};

export const useEditSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, submission }) => {
      if (!assignmentId) {
        throw new Error("Assignment ID is required");
      }
      return editSubmission(assignmentId, submission);
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Success",
        description: "Submission updated successfully",
      });
      if (variables.batchId && variables.assignmentId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.detail(
            variables.batchId,
            variables.assignmentId
          ),
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update submission",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAttachment,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(
          response.batchId,
          response.data.assignment
        ),
        refetchType: "active",
      });

      toast({
        title: "Success",
        description: "Attachment removed successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to remove attachment",
        variant: "destructive",
      });
    },
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, marks, feedback }) => {
      return api.put(`/submissions/${submissionId}/grade`, {
        marks,
        feedback,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(submissionKeys.list(data.assignment));
      queryClient.invalidateQueries(
        submissionKeys.detail(variables.submissionId)
      );

      toast({
        title: "Success",
        description: "Submission graded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to grade submission",
        variant: "destructive",
      });
    },
  });
};
