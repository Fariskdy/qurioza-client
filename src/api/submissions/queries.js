import { api } from "../axios";

export const submissionKeys = {
  all: ["submissions"],
  detail: (submissionId) => [...submissionKeys.all, "detail", submissionId],
  list: (assignmentId, type) => [
    ...submissionKeys.all,
    "list",
    assignmentId,
    type,
  ],
  quiz: (quizId, type) => [...submissionKeys.all, "quiz", quizId, type],
  student: (batchId) => [...submissionKeys.all, "student", batchId],
};

export const getSubmission = async (submissionId) => {
  const { data } = await api.get(`/submissions/${submissionId}`);
  return data;
};

export const getAssignmentSubmissions = async ({ assignmentId, type }) => {
  const { data } = await api.get(
    `/submissions/assignments/${assignmentId}/${type}`
  );
  return data;
};

export const getQuizSubmissions = async ({ quizId, type }) => {
  const { data } = await api.get(`/submissions/quizzes/${quizId}/${type}`);
  return data;
};

export const getStudentSubmissions = async (batchId) => {
  const { data } = await api.get(`/submissions/student/${batchId}`);
  return data;
};
