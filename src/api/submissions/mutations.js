import { api } from "../axios";

export const submitAssignment = async ({
  batchId,
  assignmentId,
  submission,
}) => {
  const { data } = await api.post(
    `/submissions/assignments/${assignmentId}`,
    submission,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const submitQuiz = async ({ batchId, quizId, answers }) => {
  const { data } = await api.post(`/submissions/quizzes/${quizId}`, {
    answers,
  });
  return data;
};

export const editSubmission = async (assignmentId, submission) => {
  if (!assignmentId) {
    throw new Error("Assignment ID is required");
  }
  const response = await api.put(
    `/submissions/assignments/${assignmentId}/edit`,
    submission,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const removeAttachment = async ({
  assignmentId,
  attachmentId,
  batchId,
}) => {
  if (!assignmentId || !attachmentId) {
    throw new Error("Assignment ID and Attachment ID are required");
  }
  const { data } = await api.delete(
    `/submissions/assignments/${assignmentId}/attachments/${attachmentId}`
  );
  return { data, batchId }; // Return batchId for query invalidation
};
