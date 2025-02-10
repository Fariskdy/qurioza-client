import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherKeys, getTeachers, getTeacher } from "./queries";
import { createTeacher, updateTeacher, deleteTeacher } from "./mutations";

// Query Hooks
export const useTeachers = () => {
  return useQuery({
    queryKey: teacherKeys.list(),
    queryFn: getTeachers,
  });
};

export const useTeacher = (id) => {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => getTeacher(id),
    enabled: !!id,
  });
};

// Mutation Hooks
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.list() });
      return data;
    },
    onError: (error) => {
      throw error.response?.data || error;
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: teacherKeys.list() });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.list() });
    },
  });
};
