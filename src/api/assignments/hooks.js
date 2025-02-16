import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignmentKeys,
  getAssignments,
  getAssignment,
  getAssignmentSubmissions,
  getBatchAssignmentStats,
  getEnrolledBatchesWithAssignments,
  getStudentAssignments,
  getAssignmentDetails,
} from "./queries";
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "./mutations";

// Query Hooks
export const useAssignments = (batchId) => {
  return useQuery({
    queryKey: assignmentKeys.list(batchId),
    queryFn: () => getAssignments(batchId),
    enabled: !!batchId,
  });
};

export const useAssignment = (batchId, assignmentId) => {
  return useQuery({
    queryKey: assignmentKeys.detail(batchId, assignmentId),
    queryFn: () => getAssignment({ batchId, assignmentId }),
    enabled: !!batchId && !!assignmentId,
  });
};

export const useAssignmentDetails = (batchId, assignmentId) => {
  return useQuery({
    queryKey: assignmentKeys.detail(batchId, assignmentId),
    queryFn: () => getAssignmentDetails(batchId, assignmentId),
    enabled: !!batchId && !!assignmentId,
  });
};

export const useAssignmentSubmissions = (batchId, assignmentId) => {
  return useQuery({
    queryKey: assignmentKeys.submissions(batchId, assignmentId),
    queryFn: () => getAssignmentSubmissions({ batchId, assignmentId }),
    enabled: !!batchId && !!assignmentId,
  });
};

export const useBatchAssignmentStats = (batchId) => {
  return useQuery({
    queryKey: assignmentKeys.stats(batchId),
    queryFn: () => getBatchAssignmentStats(batchId),
    enabled: !!batchId,
  });
};

// Add new student-specific hooks
export const useEnrolledBatchesWithAssignments = () => {
  return useQuery({
    queryKey: assignmentKeys.enrolledBatches(),
    queryFn: getEnrolledBatchesWithAssignments,
  });
};

export const useStudentAssignments = (batchId) => {
  return useQuery({
    queryKey: assignmentKeys.studentAssignments(batchId),
    queryFn: () => getStudentAssignments(batchId),
    enabled: !!batchId,
  });
};

// Mutation Hooks
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssignment,
    onSuccess: (data, { batchId }) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list(batchId) });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAssignment,
    onSuccess: (data, { batchId, assignmentId }) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(batchId, assignmentId),
      });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list(batchId) });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: (data, { batchId }) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list(batchId) });
    },
  });
};
