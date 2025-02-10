import { api } from "../axios";

export const createModule = async ({ courseId, moduleData }) => {
  const formData = new FormData();

  // Append module data
  Object.keys(moduleData).forEach((key) => {
    if (typeof moduleData[key] === "object") {
      formData.append(key, JSON.stringify(moduleData[key]));
    } else {
      formData.append(key, moduleData[key]);
    }
  });

  const { data } = await api.post(`/courses/${courseId}/modules`, formData);
  return data;
};

export const updateModule = async ({ courseId, moduleId, moduleData }) => {
  const formData = new FormData();

  Object.keys(moduleData).forEach((key) => {
    if (Array.isArray(moduleData[key])) {
      formData.append(key, JSON.stringify(moduleData[key]));
    } else if (typeof moduleData[key] === "object") {
      formData.append(key, JSON.stringify(moduleData[key]));
    } else {
      formData.append(key, moduleData[key]);
    }
  });

  const { data } = await api.put(
    `/courses/${courseId}/modules/${moduleId}`,
    formData
  );
  return data;
};

export const deleteModule = async ({ courseId, moduleId }) => {
  const { data } = await api.delete(`/courses/${courseId}/modules/${moduleId}`);
  return data;
};

export const reorderModule = async ({ courseId, moduleId, newOrder }) => {
  const { data } = await api.put(
    `/courses/${courseId}/modules/${moduleId}/reorder`,
    {
      newOrder,
    }
  );
  return data;
};

// Content mutations
export const addModuleContent = async ({ courseId, moduleId, contentData }) => {
  const formData = new FormData();

  // If there's a file (document), append it with the uniqueId as the field name
  if (contentData.file) {
    console.log("Appending file with uniqueId:", contentData.uniqueId);
    formData.append(contentData.uniqueId, contentData.file);

    // Remove the file from contentData before stringifying
    const { file, ...contentWithoutFile } = contentData;
    formData.append("content", JSON.stringify(contentWithoutFile));
  } else {
    // For other content types, just stringify the whole content data
    formData.append("content", JSON.stringify(contentData));
  }

  console.log("FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, ":", value);
  }

  const { data } = await api.post(
    `/courses/${courseId}/modules/${moduleId}/content`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const updateModuleContent = async ({
  courseId,
  moduleId,
  contentId,
  contentData,
}) => {
  const { data } = await api.put(
    `/courses/${courseId}/modules/${moduleId}/content/${contentId}`,
    contentData
  );
  return data;
};

export const deleteModuleContent = async ({
  courseId,
  moduleId,
  contentId,
}) => {
  const { data } = await api.delete(
    `/courses/${courseId}/modules/${moduleId}/content/${contentId}`
  );
  return data;
};

export const reorderModuleContent = async ({
  courseId,
  moduleId,
  contentId,
  newOrder,
}) => {
  const { data } = await api.put(
    `/courses/${courseId}/modules/${moduleId}/content/${contentId}/reorder`,
    { newOrder }
  );
  return data;
};
