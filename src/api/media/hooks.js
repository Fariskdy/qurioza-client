import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaKeys, getUnassociatedMedia, getMediaStatus } from "./queries";
import {
  initializeMediaUpload,
  uploadMedia,
  associateMedia,
  handleMediaUpload,
} from "./mutations";

export const useUnassociatedMedia = () => {
  return useQuery({
    queryKey: mediaKeys.unassociated(),
    queryFn: getUnassociatedMedia,
  });
};

export const useMediaStatus = (mediaId) => {
  return useQuery({
    queryKey: mediaKeys.detail(mediaId),
    queryFn: () => getMediaStatus(mediaId),
    enabled: !!mediaId,
    // Poll for status updates if media is processing
    refetchInterval: (data) => (data?.status === "processing" ? 2000 : false),
  });
};

export const useInitializeUpload = () => {
  return useMutation({
    mutationFn: initializeMediaUpload,
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadMedia,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.unassociated() });
    },
  });
};

export const useAssociateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: associateMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.unassociated() });
    },
  });
};

// Combined hook for complete upload flow
export const useMediaUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleMediaUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.unassociated() });
    },
  });
};

// Custom hook for handling video uploads with progress
export const useVideoUpload = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, completed, error
  const uploadMutation = useMediaUpload();

  const upload = async (file) => {
    try {
      setStatus("uploading");
      setProgress(0);

      const result = await uploadMutation.mutateAsync({
        file,
        uploadType: "video",
        onProgress: (percent) => {
          setProgress(percent);
        },
      });

      setStatus("completed");
      return result;
    } catch (error) {
      setStatus("error");
      throw error;
    }
  };

  return {
    upload,
    progress,
    status,
    isLoading: uploadMutation.isLoading,
    error: uploadMutation.error,
  };
};
