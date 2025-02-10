import { api } from "../axios";

export const createCourse = async (courseData) => {
  const formData = new FormData();

  // Append text fields
  Object.keys(courseData).forEach((key) => {
    if (key !== "image" && key !== "previewVideo") {
      if (Array.isArray(courseData[key])) {
        // Convert array to JSON string before sending
        formData.append(key, JSON.stringify(courseData[key]));
      } else if (typeof courseData[key] === "object") {
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    }
  });

  // Append files if they exist
  if (courseData.image) {
    formData.append("image", courseData.image);
  }
  if (courseData.previewVideo) {
    formData.append("previewVideo", courseData.previewVideo);
  }

  const { data } = await api.post("/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateCourse = async ({ id, ...courseData }) => {
  const formData = new FormData();

  Object.keys(courseData).forEach((key) => {
    if (key !== "image" && key !== "previewVideo") {
      if (Array.isArray(courseData[key])) {
        courseData[key].forEach((item) => formData.append(key, item));
      } else if (typeof courseData[key] === "object") {
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    }
  });

  if (courseData.image) {
    formData.append("image", courseData.image);
  }
  if (courseData.previewVideo) {
    formData.append("previewVideo", courseData.previewVideo);
  }

  const { data } = await api.put(`/courses/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await api.delete(`/courses/${id}`);
  return data;
};

export const publishCourse = async (id) => {
  const { data } = await api.patch(`/courses/${id}/publish`);
  return data;
};

export const updateCourseImage = async ({ id, image }) => {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await api.put(`/courses/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateCourseVideo = async ({ id, videoId }) => {
  const { data } = await api.put(`/courses/${id}/video`, { videoId });
  return data;
};
