import { cn } from "@/lib/utils";

export function CustomScroll({ className, ...props }) {
  return (
    <div
      className={cn(
        "[&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar]:h-2",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-zinc-200",
        "dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800",
        "[&::-webkit-scrollbar-thumb]:hover:bg-zinc-300",
        "dark:[&::-webkit-scrollbar-thumb]:hover:bg-zinc-700",
        "scrollbar-thin",
        "scrollbar-thumb-zinc-200",
        "dark:scrollbar-thumb-zinc-800",
        "scrollbar-track-transparent",
        className
      )}
      {...props}
    />
  );
}
