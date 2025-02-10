import { api } from "../axios";

export const initializeMediaUpload = async () => {
  const { data } = await api.post("/media/initialize");
  return data;
};

export const uploadMedia = async ({
  mediaId,
  file,
  uploadType,
  onProgress,
}) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(
    `/media/${mediaId}/upload?uploadType=${uploadType}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Call the progress callback if provided
          onProgress?.(percentCompleted);
        }
      },
    }
  );
  return data;
};

export const associateMedia = async ({ mediaId, model, id }) => {
  const { data } = await api.put(`/media/${mediaId}/associate`, {
    model,
    id,
  });
  return data;
};

// Helper function to handle the complete upload flow
export const handleMediaUpload = async ({ file, uploadType, onProgress }) => {
  // Step 1: Initialize upload
  const { mediaId } = await initializeMediaUpload();

  // Step 2: Upload the file with progress tracking
  const uploadedMedia = await uploadMedia({
    mediaId,
    file,
    uploadType,
    onProgress,
  });

  return uploadedMedia;
};
