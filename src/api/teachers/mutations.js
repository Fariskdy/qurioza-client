import { api } from "../axios";

// Create a new teacher
export const createTeacher = async (teacherData) => {
  const { data } = await api.post("/teachers", teacherData);
  return data;
};

// Update a teacher
export const updateTeacher = async ({ id, ...teacherData }) => {
  const { data } = await api.put(`/teachers/${id}`, teacherData);
  return data;
};

// Delete a teacher
export const deleteTeacher = async (id) => {
  const { data } = await api.delete(`/teachers/${id}`);
  return data;
};
