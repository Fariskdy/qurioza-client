import { api } from "../axios";

export const batchKeys = {
  all: ["batches"],
  list: (courseId) => [...batchKeys.all, "list", courseId],
  detail: (courseId, batchId) => [
    ...batchKeys.all,
    "detail",
    courseId,
    batchId,
  ],
  students: (courseId, batchId) => [
    ...batchKeys.all,
    "students",
    courseId,
    batchId,
  ],
  enrolling: (courseId) => [...batchKeys.all, "enrolling", courseId],
};

export const getBatches = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/batches`);
  return data;
};

export const getBatch = async ({ courseId, batchId }) => {
  const { data } = await api.get(`/courses/${courseId}/batches/${batchId}`);
  return data;
};

export const getBatchStudents = async ({ courseId, batchId }) => {
  const { data } = await api.get(
    `/courses/${courseId}/batches/${batchId}/students`
  );
  return data;
};

export const getEnrollingBatch = async (courseId) => {
  const { data } = await api.get(
    `/courses/${courseId}/batches/enrolling-batch`
  );
  return data;
};
