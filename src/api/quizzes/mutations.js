import { api } from "../axios";

export const createQuiz = async (quizData) => {
  const { data } = await api.post("/quizzes", quizData);
  return data;
};

export const updateQuiz = async ({ quizId, ...quizData }) => {
  const { data } = await api.put(`/quizzes/${quizId}`, quizData);
  return data;
};

export const deleteQuiz = async (quizId) => {
  const { data } = await api.delete(`/quizzes/${quizId}`);
  return data;
};
