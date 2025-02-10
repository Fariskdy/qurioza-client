import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  courseKeys,
  getCourses,
  getCourse,
  getCoordinatorCourses,
  getRelatedCourses,
  getFeaturedCourses,
  getPopularCourses,
  getStats,
  getStudentCourses,
} from "./queries";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  updateCourseImage,
  updateCourseVideo,
} from "./mutations";

export const useCourses = (params) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => getCourses(params),
    keepPreviousData: true,
  });
};

export const useCourse = (slug) => {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => getCourse(slug),
    enabled: Boolean(slug),
  });
};

export const useCoordinatorCourses = () => {
  return useQuery({
    queryKey: courseKeys.coordinator(),
    queryFn: getCoordinatorCourses,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
      queryClient.invalidateQueries({ queryKey: courseKeys.coordinator() });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.slug) });
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
      queryClient.invalidateQueries({ queryKey: courseKeys.coordinator() });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
      queryClient.invalidateQueries({ queryKey: courseKeys.coordinator() });
    },
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.slug) });
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
      queryClient.invalidateQueries({ queryKey: courseKeys.coordinator() });
    },
  });
};

export const useRelatedCourses = (slug) => {
  return useQuery({
    queryKey: [...courseKeys.all, "related", slug],
    queryFn: () => getRelatedCourses(slug),
    enabled: !!slug,
  });
};

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: [...courseKeys.all, "featured"],
    queryFn: getFeaturedCourses,
  });
};

export const usePopularCourses = () => {
  return useQuery({
    queryKey: [...courseKeys.all, "popular"],
    queryFn: getPopularCourses,
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: [...courseKeys.all, "stats"],
    queryFn: getStats,
  });
};

export const useUpdateCourseImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseImage,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      });
    },
  });
};

export const useUpdateCourseVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseVideo,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      });
    },
  });
};

export const useStudentCourses = (params) => {
  return useQuery({
    queryKey: courseKeys.student(),
    queryFn: () => getStudentCourses(params),
    keepPreviousData: true,
  });
};
