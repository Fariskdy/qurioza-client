import { api } from "../axios";

export const profileKeys = {
  all: ["profile"],
  me: () => [...profileKeys.all, "me"],
  public: (userId) => [...profileKeys.all, "public", userId],
};

export const getMyProfile = async () => {
  const { data } = await api.get("/profile");
  return data;
};

export const getPublicProfile = async (userId) => {
  const { data } = await api.get(`/profile/${userId}`);
  return data;
};
