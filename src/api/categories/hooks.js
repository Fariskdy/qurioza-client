import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryKeys, getCategories, getCategory } from "./queries";
import { createCategory, updateCategory, deleteCategory } from "./mutations";

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });
};

export const useCategory = (slug) => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => getCategory(slug),
    enabled: !!slug, // Only run query if slug is provided
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(data.slug),
      });
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
};
