import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const Icon = variant === "destructive" ? AlertCircle : CheckCircle;
        const iconColor =
          variant === "destructive"
            ? "text-red-500 dark:text-red-400"
            : "text-green-500 dark:text-green-400";
        const titleColor =
          variant === "destructive"
            ? "text-red-700 dark:text-red-200"
            : "text-green-700 dark:text-green-200";
        const descriptionColor =
          variant === "destructive"
            ? "text-red-600 dark:text-red-200/90"
            : "text-green-600 dark:text-green-200/90";

        return (
          <Toast
            key={id}
            {...props}
            variant={variant}
            className={cn(
              "group shadow-lg dark:shadow-black/25",
              // Add extra background opacity for better readability
              variant === "destructive"
                ? "dark:bg-red-950/95"
                : variant === "success"
                ? "dark:bg-green-950/95"
                : "dark:bg-[#202F36]/95"
            )}
          >
            <div className="flex gap-3">
              <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor)} />
              <div className="grid gap-1">
                {title && (
                  <ToastTitle className={cn("font-medium", titleColor)}>
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription
                    className={cn("font-medium", descriptionColor)}
                  >
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="text-foreground/70 hover:text-foreground dark:text-gray-300 dark:hover:text-gray-100" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
