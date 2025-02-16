import { api } from "../axios";

export const assignmentKeys = {
  all: ["assignments"],
  list: (batchId) => [...assignmentKeys.all, "list", batchId],
  detail: (batchId, assignmentId) => [
    ...assignmentKeys.all,
    "detail",
    batchId,
    assignmentId,
  ],
  submissions: (batchId, assignmentId) => [
    ...assignmentKeys.all,
    "submissions",
    batchId,
    assignmentId,
  ],
  stats: (batchId) => [...assignmentKeys.all, "stats", batchId],
  enrolledBatches: () => [...assignmentKeys.all, "enrolled-batches"],
  studentAssignments: (batchId) => [...assignmentKeys.all, "student", batchId],
};

export const getAssignments = async (batchId) => {
  const { data } = await api.get(`/batches/${batchId}/assignments/all`);
  return data;
};

export const getAssignment = async ({ batchId, assignmentId }) => {
  const { data } = await api.get(
    `/student/assignments/batch/${batchId}/assignment/${assignmentId}`
  );
  return data;
};

export const getAssignmentDetails = async (batchId, assignmentId) => {
  const { data } = await api.get(
    `/batches/${batchId}/assignments/${assignmentId}`
  );
  return data;
};

export const getAssignmentSubmissions = async ({ batchId, assignmentId }) => {
  const { data } = await api.get(
    `/batches/${batchId}/assignments/${assignmentId}/submissions`
  );
  return data;
};

export const getBatchAssignmentStats = async (batchId) => {
  const { data } = await api.get(`/batches/${batchId}/assignments/stats`);
  return data;
};

export const getEnrolledBatchesWithAssignments = async () => {
  const { data } = await api.get(`/student/assignments/enrolled-batches`);
  return data;
};

export const getStudentAssignments = async (batchId) => {
  const { data } = await api.get(`/student/assignments/batch/${batchId}`);
  return data;
};
