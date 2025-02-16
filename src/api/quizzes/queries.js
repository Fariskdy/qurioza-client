import { api } from "../axios";

export const quizKeys = {
  all: ["quizzes"],
  list: () => [...quizKeys.all, "list"],
  detail: (id) => [...quizKeys.all, "detail", id],
  stats: () => [...quizKeys.all, "stats"],
  studentStats: () => [...quizKeys.all, "student", "stats"],
  batchQuizzes: (batchId) => [...quizKeys.all, "batch", batchId],
  studentBatchQuizzes: (batchId) => [
    ...quizKeys.all,
    "student",
    "batch",
    batchId,
  ],
  submissions: (quizId) => [...quizKeys.all, "submissions", quizId],
  review: (quizId) => [...quizKeys.all, "review", quizId],
};

// Get teacher's quiz statistics
export const getTeacherQuizStats = async () => {
  const { data } = await api.get("/quizzes/teacher/stats");
  return data;
};

// Get student's quiz statistics
export const getStudentQuizStats = async () => {
  const { data } = await api.get("/quizzes/student/stats");
  return data;
};

// Get all quizzes for a batch
export const getBatchQuizzes = async (batchId) => {
  const { data } = await api.get(`/quizzes/batch/${batchId}`);
  return data;
};

// Get all quizzes for a student's batch
export const getStudentBatchQuizzes = async (batchId) => {
  const { data } = await api.get(`/quizzes/student/batch/${batchId}`);
  return data;
};

// Get a specific quiz
export const getQuiz = async (quizId, { includeStats } = {}) => {
  const { data } = await api.get(`/quizzes/${quizId}`, {
    params: { includeStats },
  });
  return data;
};

// Get a specific quiz for student
export const getStudentQuiz = async (quizId) => {
  const { data } = await api.get(`/quizzes/student/${quizId}`);
  return data;
};

// Get quiz submissions
export const getQuizSubmissions = async ({
  quizId,
  page = 1,
  limit = 10,
  sort = "-submittedAt",
}) => {
  const { data } = await api.get(`/quizzes/${quizId}/submissions`, {
    params: { page, limit, sort },
  });
  return data;
};

// Get quiz for student attempt
export const getQuizForAttempt = async (quizId) => {
  const { data } = await api.get(`/quizzes/student/${quizId}/attempt`);
  return data;
};

// Submit quiz attempt
export const submitQuizAttempt = async ({ quizId, answers }) => {
  const { data } = await api.post(`/quizzes/student/${quizId}/submit`, {
    answers,
  });
  return data;
};

// Get quiz review
export const getQuizReview = async (quizId) => {
  const { data } = await api.get(`/quizzes/student/${quizId}/review`);
  return data;
};
