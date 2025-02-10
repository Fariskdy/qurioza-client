import { api } from "../axios";

export const createBatch = async ({ courseId, batchData }) => {
  const { data } = await api.post(`/courses/${courseId}/batches`, batchData);
  return data;
};

export const updateBatch = async ({ courseId, batchId, batchData }) => {
  const { data } = await api.put(
    `/courses/${courseId}/batches/${batchId}`,
    batchData
  );
  return data;
};

export const deleteBatch = async ({ courseId, batchId }) => {
  const { data } = await api.delete(`/courses/${courseId}/batches/${batchId}`);
  return data;
};

export const updateBatchStatus = async ({ courseId, batchId, status }) => {
  const { data } = await api.put(
    `/courses/${courseId}/batches/${batchId}/status`,
    { status }
  );
  return data;
};

export const assignTeachers = async ({ courseId, batchId, teacherIds }) => {
  const { data } = await api.put(
    `/courses/${courseId}/batches/${batchId}/teachers`,
    { teachers: teacherIds }
  );
  return data;
};

export const toggleAutoUpdate = async ({ courseId, batchId, enabled }) => {
  const { data } = await api.put(
    `/courses/${courseId}/batches/${batchId}/auto-update`,
    { enabled }
  );
  return data;
};
