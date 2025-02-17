import { api } from "../axios";

export const updateProfile = async (profileData) => {
  const { data } = await api.put("/profile", profileData);
  return data;
};

export const updateAvatar = async (imageFile) => {
  const formData = new FormData();
  formData.append("avatar", imageFile);

  const { data } = await api.put("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await api.put("/profile/change-password", passwordData);
  return data;
};
