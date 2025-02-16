import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  quizKeys,
  getTeacherQuizStats,
  getStudentQuizStats,
  getBatchQuizzes,
  getStudentBatchQuizzes,
  getQuiz,
  getStudentQuiz,
  getQuizSubmissions,
  getQuizForAttempt,
  submitQuizAttempt,
  getQuizReview,
} from "./queries";
import { createQuiz, updateQuiz, deleteQuiz } from "./mutations";

// Query Hooks

export const useTeacherQuizStats = () => {
  return useQuery({
    queryKey: quizKeys.stats(),
    queryFn: getTeacherQuizStats,
  });
};

export const useStudentQuizStats = () => {
  return useQuery({
    queryKey: quizKeys.studentStats(),
    queryFn: getStudentQuizStats,
  });
};

export const useBatchQuizzes = (batchId) => {
  return useQuery({
    queryKey: quizKeys.batchQuizzes(batchId),
    queryFn: () => getBatchQuizzes(batchId),
    enabled: !!batchId,
  });
};

export const useStudentBatchQuizzes = (batchId) => {
  return useQuery({
    queryKey: quizKeys.studentBatchQuizzes(batchId),
    queryFn: () => getStudentBatchQuizzes(batchId),
    enabled: !!batchId,
  });
};

export const useQuiz = (quizId, options = {}) => {
  return useQuery({
    queryKey: quizKeys.detail(quizId),
    queryFn: () => getQuiz(quizId, options),
    enabled: !!quizId,
  });
};

export const useStudentQuiz = (quizId) => {
  return useQuery({
    queryKey: [...quizKeys.detail(quizId), "student"],
    queryFn: () => getStudentQuiz(quizId),
    enabled: !!quizId,
  });
};

export const useQuizSubmissions = (quizId, options = {}) => {
  const { page, limit, sort } = options;
  return useQuery({
    queryKey: [...quizKeys.submissions(quizId), { page, limit, sort }],
    queryFn: () => getQuizSubmissions({ quizId, page, limit, sort }),
    enabled: !!quizId,
  });
};

export const useQuizAttempt = (quizId) => {
  return useQuery({
    queryKey: [...quizKeys.detail(quizId), "attempt"],
    queryFn: () => getQuizForAttempt(quizId),
    enabled: !!quizId,
  });
};

export const useQuizReview = (quizId) => {
  return useQuery({
    queryKey: quizKeys.review(quizId),
    queryFn: () => getQuizReview(quizId),
    enabled: !!quizId,
  });
};

// Mutation Hooks

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      // Invalidate batch quizzes list
      queryClient.invalidateQueries({
        queryKey: quizKeys.batchQuizzes(data.batch),
      });
      // Invalidate teacher stats
      queryClient.invalidateQueries({
        queryKey: quizKeys.stats(),
      });
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuiz,
    onSuccess: (data) => {
      // Invalidate specific quiz
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(data._id),
      });
      // Invalidate batch quizzes list
      queryClient.invalidateQueries({
        queryKey: quizKeys.batchQuizzes(data.batch),
      });
      // Invalidate teacher stats
      queryClient.invalidateQueries({
        queryKey: quizKeys.stats(),
      });
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: (_, variables) => {
      // Variables will contain the quizId
      // We'll need to pass the batchId when calling the mutation
      const batchId = variables.batchId;

      // Invalidate batch quizzes list
      queryClient.invalidateQueries({
        queryKey: quizKeys.batchQuizzes(batchId),
      });
      // Invalidate teacher stats
      queryClient.invalidateQueries({
        queryKey: quizKeys.stats(),
      });
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQuizAttempt,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(
        quizKeys.studentBatchQuizzes(variables.batchId)
      );
      queryClient.invalidateQueries(quizKeys.studentStats());
    },
  });
};
