import { api } from "../axios";

export const createCategory = async (categoryData) => {
  // Create FormData for multipart/form-data request
  const formData = new FormData();

  // Append text fields
  formData.append("name", categoryData.name);
  formData.append("description", categoryData.description);
  if (categoryData.status) {
    formData.append("status", categoryData.status);
  }

  // Append image if exists
  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }

  const { data } = await api.post("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateCategory = async ({ id, ...categoryData }) => {
  // Create FormData for multipart/form-data request
  const formData = new FormData();

  // Append text fields if they exist
  if (categoryData.name) {
    formData.append("name", categoryData.name);
  }
  if (categoryData.description) {
    formData.append("description", categoryData.description);
  }
  if (categoryData.status) {
    formData.append("status", categoryData.status);
  }

  // Append image if exists
  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }

  const { data } = await api.put(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};
