import { api } from "../axios";

export const mediaKeys = {
  all: ["media"],
  list: () => [...mediaKeys.all, "list"],
  unassociated: () => [...mediaKeys.all, "unassociated"],
  detail: (mediaId) => [...mediaKeys.all, "detail", mediaId],
};

export const getUnassociatedMedia = async () => {
  const { data } = await api.get("/media/unassociated");
  return data;
};

export const getMediaStatus = async (mediaId) => {
  const { data } = await api.get(`/media/${mediaId}/status`);
  return data;
};
