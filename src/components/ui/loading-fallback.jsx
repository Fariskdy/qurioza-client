import { Skeleton } from "@/components/ui/skeleton";

export function LoadingFallback() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Loading */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="p-4">
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 py-3"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 