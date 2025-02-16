import { api } from "../axios";

export const createAssignment = async ({ batchId, assignmentData }) => {
  const { data } = await api.post(
    `/batches/${batchId}/assignments`,
    assignmentData
  );
  return data;
};

export const updateAssignment = async ({
  batchId,
  assignmentId,
  assignmentData,
}) => {
  const { data } = await api.put(
    `/batches/${batchId}/assignments/${assignmentId}`,
    assignmentData
  );
  return data;
};

export const deleteAssignment = async ({ batchId, assignmentId }) => {
  const { data } = await api.delete(
    `/batches/${batchId}/assignments/${assignmentId}`
  );
  return data;
};
