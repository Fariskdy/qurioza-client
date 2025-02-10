import { api } from "../axios";

export const moduleKeys = {
  all: ["modules"],
  list: (courseId) => [...moduleKeys.all, "list", courseId],
  detail: (courseId, moduleId) => [
    ...moduleKeys.all,
    "detail",
    courseId,
    moduleId,
  ],
  content: (courseId, moduleId) => [
    ...moduleKeys.all,
    "content",
    courseId,
    moduleId,
  ],
  contentItem: (courseId, moduleId, contentId) => [
    ...moduleKeys.all,
    "content",
    courseId,
    moduleId,
    contentId,
  ],
  public: (courseId) => [...moduleKeys.all, "public", courseId],
  enrolled: (courseId) => [...moduleKeys.all, "enrolled", courseId],
};

/// coordinators
export const getModules = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/modules`);
  return data;
};

export const getModule = async (courseId, moduleId) => {
  const { data } = await api.get(`/courses/${courseId}/modules/${moduleId}`);
  return data;
};

export const getModuleContent = async (courseId, moduleId) => {
  const { data } = await api.get(
    `/courses/${courseId}/modules/${moduleId}/content`
  );
  return data;
};

export const getModuleContentItem = async (courseId, moduleId, contentId) => {
  const { data } = await api.get(
    `/courses/${courseId}/modules/${moduleId}/content/${contentId}`
  );
  return data;
};

// Public modules (website visitors)
export const getPublicModules = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/modules/public`);
  return data;
};

// Enrolled student modules
export const getEnrolledModules = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/modules/enrolled`);
  return data;
};
