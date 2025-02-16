import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className, ...props }) {
  return (
    <Loader2
      className={cn("h-6 w-6 animate-spin text-violet-600", className)}
      {...props}
    />
  );
}
