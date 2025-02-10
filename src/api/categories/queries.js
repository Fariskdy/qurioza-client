import { api } from "../axios";

export const categoryKeys = {
  all: ["categories"],
  list: () => [...categoryKeys.all, "list"],
  detail: (slug) => [...categoryKeys.all, "detail", slug],
};

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const getCategory = async (slug) => {
  const { data } = await api.get(`/categories/${slug}`);
  return data;
};
