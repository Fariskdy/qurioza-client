import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  enrollmentKeys,
  getEnrollments,
  getEnrollment,
  getStudentProgress,
  getBatchEnrollments,
} from "./queries";
import { enrollInBatch, updateEnrollmentStatus } from "./mutations";

// Query Hooks
export const useEnrollments = () => {
  return useQuery({
    queryKey: enrollmentKeys.list(),
    queryFn: getEnrollments,
  });
};

export const useEnrollment = (enrollmentId) => {
  return useQuery({
    queryKey: enrollmentKeys.detail(enrollmentId),
    queryFn: () => getEnrollment(enrollmentId),
    enabled: !!enrollmentId,
  });
};

export const useStudentProgress = (enrollmentId) => {
  return useQuery({
    queryKey: enrollmentKeys.progress(enrollmentId),
    queryFn: () => getStudentProgress(enrollmentId),
    enabled: !!enrollmentId,
  });
};

export const useBatchEnrollments = (batchId) => {
  return useQuery({
    queryKey: enrollmentKeys.batchEnrollments(batchId),
    queryFn: () => getBatchEnrollments(batchId),
    enabled: !!batchId,
  });
};

// Mutation Hooks
export const useEnrollInBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollInBatch,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.list() });
    },
  });
};

export const useUpdateEnrollmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEnrollmentStatus,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.detail(data._id),
      });
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.batchEnrollments(data.batch),
      });
    },
  });
};
