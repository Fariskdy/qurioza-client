import { api } from "../axios";

export const courseKeys = {
  all: ["courses"],
  list: (params) => [...courseKeys.all, "list", params],
  detail: (slug) => [...courseKeys.all, "detail", slug],
  coordinator: () => [...courseKeys.all, "coordinator"],
  student: () => [...courseKeys.all, "student"],
};

export const getCourses = async (params) => {
  const { data } = await api.get("/courses", { params });
  return data;
};

export const getCourse = async (slug) => {
  console.log("Fetching course with slug:", slug);
  try {
    const { data } = await api.get(`/courses/${slug}`);
    console.log("Course data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

export const getCoordinatorCourses = async () => {
  const { data } = await api.get("/courses/coordinator/my-courses");
  return data;
};

export const getRelatedCourses = async (slug) => {
  const { data } = await api.get(`/courses/${slug}/related`);
  return data;
};

export const getFeaturedCourses = async () => {
  const { data } = await api.get("/courses/featured");
  return data;
};

export const getPopularCourses = async () => {
  const { data } = await api.get("/courses", {
    params: {
      sort: "popular",
      limit: 3,
    },
  });
  return data;
};

export const getStats = async () => {
  const { data } = await api.get("/courses/stats");
  return data;
};

export const getStudentCourses = async (params) => {
  const { data } = await api.get("/courses/student/my-courses", { params });
  return data;
};
