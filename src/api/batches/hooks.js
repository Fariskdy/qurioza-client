import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  batchKeys,
  getBatches,
  getBatch,
  getBatchStudents,
  getEnrollingBatch,
} from "./queries";
import {
  createBatch,
  updateBatch,
  deleteBatch,
  updateBatchStatus,
  assignTeachers,
  toggleAutoUpdate,
} from "./mutations";

// Query Hooks
export const useBatches = (courseId) => {
  return useQuery({
    queryKey: batchKeys.list(courseId),
    queryFn: () => getBatches(courseId),
    enabled: !!courseId,
  });
};

export const useBatch = (courseId, batchId) => {
  return useQuery({
    queryKey: batchKeys.detail(courseId, batchId),
    queryFn: () => getBatch({ courseId, batchId }),
    enabled: !!courseId && !!batchId,
  });
};

export const useBatchStudents = (courseId, batchId) => {
  return useQuery({
    queryKey: batchKeys.students(courseId, batchId),
    queryFn: () => getBatchStudents({ courseId, batchId }),
    enabled: !!courseId && !!batchId,
  });
};

export const useEnrollingBatch = (courseId) => {
  return useQuery({
    queryKey: batchKeys.enrolling(courseId),
    queryFn: () => getEnrollingBatch(courseId),
    enabled: !!courseId,
  });
};

// Mutation Hooks
export const useCreateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBatch,
    onSuccess: (data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.list(courseId) });
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBatch,
    onSuccess: (data, { courseId, batchId }) => {
      queryClient.invalidateQueries({
        queryKey: batchKeys.detail(courseId, batchId),
      });
      queryClient.invalidateQueries({ queryKey: batchKeys.list(courseId) });
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBatch,
    onSuccess: (data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.list(courseId) });
    },
  });
};

export const useUpdateBatchStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBatchStatus,
    onSuccess: (data, { courseId, batchId }) => {
      queryClient.invalidateQueries({
        queryKey: batchKeys.detail(courseId, batchId),
      });
      queryClient.invalidateQueries({ queryKey: batchKeys.list(courseId) });
    },
  });
};

export const useAssignTeachers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignTeachers,
    onSuccess: (data, { courseId, batchId }) => {
      queryClient.invalidateQueries({
        queryKey: batchKeys.detail(courseId, batchId),
      });
      queryClient.invalidateQueries({ queryKey: batchKeys.list(courseId) });
    },
  });
};

export const useToggleAutoUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleAutoUpdate,
    onSuccess: (data, { courseId, batchId }) => {
      queryClient.invalidateQueries({
        queryKey: batchKeys.detail(courseId, batchId),
      });
      queryClient.invalidateQueries({ queryKey: batchKeys.list(courseId) });
    },
  });
};
