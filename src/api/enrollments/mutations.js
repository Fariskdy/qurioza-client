import { api } from "../axios";

// Enroll in a batch
export const enrollInBatch = async (batchId) => {
  const { data } = await api.post(`/enrollments/batches/${batchId}`);
  return data;
};

// Update enrollment status (for teachers/coordinators)
export const updateEnrollmentStatus = async ({ enrollmentId, status }) => {
  const { data } = await api.put(`/enrollments/${enrollmentId}/status`, {
    status,
  });
  return data;
};
