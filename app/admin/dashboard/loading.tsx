import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <div className="space-y-4">
        {/* Controls/Filters Area */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <Skeleton className="h-10 w-full sm:w-72" /> {/* Search/Filter */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Generic Content/Table Placeholder */}
        <div className="rounded-md border">
          {/* Table Header like bar */}
          <div className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-4 w-24 hidden md:block" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Content Rows */}
          <div className="p-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48 hidden sm:block" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
