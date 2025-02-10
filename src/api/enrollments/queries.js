import { api } from "../axios";

export const enrollmentKeys = {
  all: ["enrollments"],
  list: () => [...enrollmentKeys.all, "list"],
  detail: (enrollmentId) => [...enrollmentKeys.all, "detail", enrollmentId],
  batchEnrollments: (batchId) => [...enrollmentKeys.all, "batch", batchId],
  progress: (enrollmentId) => [...enrollmentKeys.all, "progress", enrollmentId],
};

// Get user's enrollments
export const getEnrollments = async () => {
  const { data } = await api.get("/enrollments");
  return data;
};

// Get single enrollment
export const getEnrollment = async (enrollmentId) => {
  const { data } = await api.get(`/enrollments/${enrollmentId}`);
  return data;
};

// Get student progress
export const getStudentProgress = async (enrollmentId) => {
  const { data } = await api.get(`/enrollments/${enrollmentId}/progress`);
  return data;
};

// Get batch enrollments (for teachers/coordinators)
export const getBatchEnrollments = async (batchId) => {
  const { data } = await api.get(`/enrollments/batches/${batchId}/students`);
  return data;
};
