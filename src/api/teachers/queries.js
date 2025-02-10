import { api } from "../axios";

export const teacherKeys = {
  all: ["teachers"],
  list: () => [...teacherKeys.all, "list"],
  detail: (id) => [...teacherKeys.all, "detail", id],
  profile: (id) => [...teacherKeys.all, "profile", id],
};

// Get all teachers for the logged-in coordinator
export const getTeachers = async () => {
  const { data } = await api.get("/teachers");
  return data;
};

// Get a specific teacher
export const getTeacher = async (id) => {
  const { data } = await api.get(`/teachers/${id}`);
  return data;
};
