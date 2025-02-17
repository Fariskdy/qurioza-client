import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys, getMyProfile, getPublicProfile } from "./queries";
import { updateProfile, updateAvatar, changePassword } from "./mutations";

// Hook to get logged-in user's profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
  });
};

// Hook to get public profile of any user
export const usePublicProfile = (userId) => {
  return useQuery({
    queryKey: profileKeys.public(userId),
    queryFn: () => getPublicProfile(userId),
    enabled: !!userId, // Only run query if userId is provided
  });
};

// Hook to update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      return "Profile updated successfully"; // Return message for toast
    },
  });
};

// Hook to update avatar
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      return "Avatar updated successfully"; // Return message for toast
    },
  });
};

// Hook to change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
