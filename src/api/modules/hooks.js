import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  moduleKeys,
  getModules,
  getModule,
  getModuleContent,
  getModuleContentItem,
  getPublicModules,
  getEnrolledModules,
} from "./queries";
import {
  createModule,
  updateModule,
  deleteModule,
  reorderModule,
  addModuleContent,
  updateModuleContent,
  deleteModuleContent,
  reorderModuleContent,
  markContentComplete,
} from "./mutations";

// Module queries
export const useModules = (courseId) => {
  return useQuery({
    queryKey: moduleKeys.list(courseId),
    queryFn: () => getModules(courseId),
    enabled: !!courseId,
  });
};

export const useModule = (courseId, moduleId) => {
  return useQuery({
    queryKey: moduleKeys.detail(courseId, moduleId),
    queryFn: () => getModule(courseId, moduleId),
    enabled: !!courseId && !!moduleId,
  });
};

// Module content queries
export const useModuleContent = (courseId, moduleId) => {
  return useQuery({
    queryKey: moduleKeys.content(courseId, moduleId),
    queryFn: () => getModuleContent(courseId, moduleId),
    enabled: !!courseId && !!moduleId,
  });
};

export const useModuleContentItem = (courseId, moduleId, contentId) => {
  return useQuery({
    queryKey: moduleKeys.contentItem(courseId, moduleId, contentId),
    queryFn: () => getModuleContentItem(courseId, moduleId, contentId),
    enabled: !!courseId && !!moduleId && !!contentId,
  });
};

// Public modules hook (for website visitors)
export const usePublicModules = (courseId) => {
  return useQuery({
    queryKey: moduleKeys.public(courseId),
    queryFn: () => getPublicModules(courseId),
    enabled: !!courseId,
  });
};

// Enrolled student modules hook
export const useEnrolledModules = (courseId) => {
  return useQuery({
    queryKey: moduleKeys.enrolled(courseId),
    queryFn: () => getEnrolledModules(courseId),
    enabled: !!courseId,
  });
};

// Module mutations
export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModule,
    onSuccess: (data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(courseId) });
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateModule,
    onSuccess: (data, { courseId, moduleId }) => {
      queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(courseId, moduleId),
      });
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(courseId) });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModule,
    onSuccess: (data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(courseId) });
    },
  });
};

export const useReorderModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderModule,
    onSuccess: (data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(courseId) });
    },
  });
};

// Module content mutations
export const useAddModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addModuleContent,
    onSuccess: (data, { courseId, moduleId }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(courseId) });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(courseId, moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.content(courseId, moduleId),
      });

      queryClient.setQueryData(
        moduleKeys.detail(courseId, moduleId),
        (oldData) => {
          if (!oldData) return data;
          return data;
        }
      );
    },
  });
};

export const useUpdateModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateModuleContent,
    onSuccess: (data, { courseId, moduleId }) => {
      // Invalidate and refetch all relevant queries
      queryClient.invalidateQueries({
        queryKey: moduleKeys.content(courseId, moduleId),
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(courseId, moduleId),
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.list(courseId),
        refetchType: "all",
      });

      // Optimistically update the module cache
      queryClient.setQueryData(
        moduleKeys.detail(courseId, moduleId),
        (oldData) => {
          if (!oldData || !oldData.content) return oldData;
          return {
            ...oldData,
            content: oldData.content.map((item) =>
              item._id === data._id ? { ...item, ...data } : item
            ),
          };
        }
      );

      // Force refetch to ensure data consistency
      Promise.all([
        queryClient.refetchQueries({
          queryKey: moduleKeys.content(courseId, moduleId),
        }),
        queryClient.refetchQueries({
          queryKey: moduleKeys.detail(courseId, moduleId),
        }),
        queryClient.refetchQueries({
          queryKey: moduleKeys.list(courseId),
        }),
      ]);
    },
  });
};

export const useDeleteModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModuleContent,
    onSuccess: (data, { courseId, moduleId }) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({
        queryKey: moduleKeys.content(courseId, moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(courseId, moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.list(courseId),
      });

      // Optimistically update the module cache
      queryClient.setQueryData(
        moduleKeys.detail(courseId, moduleId),
        (oldData) => {
          if (!oldData || !oldData.content) return oldData;
          return {
            ...oldData,
            content: oldData.content.filter(
              (item) => item._id !== data.contentId
            ),
          };
        }
      );
    },
  });
};

export const useReorderModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderModuleContent,
    onSuccess: (data, { courseId, moduleId }) => {
      // Update the module data in the cache
      queryClient.setQueryData(
        moduleKeys.detail(courseId, moduleId),
        (oldData) => {
          if (!oldData) return data;
          return data;
        }
      );

      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: moduleKeys.content(courseId, moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(courseId, moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: moduleKeys.list(courseId),
      });
    },
  });
};

// Update the hook to handle toggle
export const useMarkContentComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markContentComplete,
    onSuccess: (data, { courseId }) => {
      // Update enrolled modules query
      queryClient.setQueryData(["modules", "enrolled", courseId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          progress: {
            ...oldData.progress,
            overall: data.progress,
            completedModules: data.completedModules,
            completedContent: data.completedContent,
          },
        };
      });

      // Also invalidate student courses to update overall progress
      queryClient.invalidateQueries({ queryKey: ["studentCourses"] });
    },
  });
};
