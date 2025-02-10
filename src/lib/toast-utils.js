import { toast } from "@/hooks/use-toast";

export const showErrorToast = (error) => {
  const message =
    error.response?.data?.message || error.message || "An error occurred";

  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  });
};

export const showSuccessToast = (message) => {
  toast({
    title: "Success",
    description: message,
  });
};
