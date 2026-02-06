import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="isolate bg-black text-white min-h-screen">
      {/* Navbar Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-white/10" />
          <div className="hidden md:flex gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-20 bg-white/10" />
            ))}
          </div>
          <Skeleton className="h-10 w-24 bg-white/10" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6 text-center">
          <Skeleton className="h-16 md:h-24 w-3/4 md:w-1/2 mx-auto mb-6 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-white/5" />
          <Skeleton className="h-6 w-3/4 max-w-xl mx-auto mt-3 bg-white/5" />

          <div className="mt-12">
            <Skeleton className="h-12 w-12 mx-auto rounded-full bg-white/10" />
          </div>
        </div>

        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8F00AF]/20 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Events List Skeleton */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Skeleton className="h-10 md:h-12 w-64 mx-auto mb-4 bg-white/10" />
            <Skeleton className="h-5 w-full max-w-2xl mx-auto bg-white/5" />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-28 rounded-full bg-white/10"
              />
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
              >
                {/* Event Image */}
                <Skeleton className="h-48 w-full bg-white/10" />

                {/* Event Content */}
                <div className="p-5 space-y-4">
                  {/* Category Badge */}
                  <Skeleton className="h-6 w-24 rounded-full bg-white/10" />

                  {/* Event Title */}
                  <Skeleton className="h-7 w-3/4 bg-white/10" />

                  {/* Event Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-white/5" />
                    <Skeleton className="h-4 w-5/6 bg-white/5" />
                  </div>

                  {/* Event Meta Info */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
                      <Skeleton className="h-4 w-20 bg-white/5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
                      <Skeleton className="h-4 w-16 bg-white/5" />
                    </div>
                  </div>

                  {/* Button */}
                  <Skeleton className="h-10 w-full rounded-md bg-white/10 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Schedule Skeleton */}
      <section className="py-16 md:py-24 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Skeleton className="h-10 md:h-12 w-80 mx-auto mb-4 bg-white/10" />
            <Skeleton className="h-5 w-full max-w-2xl mx-auto bg-white/5" />
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-6">
                {/* Time */}
                <div className="flex-shrink-0 w-32">
                  <Skeleton className="h-6 w-full bg-white/10" />
                </div>

                {/* Event Card */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-5 space-y-3">
                  <Skeleton className="h-6 w-2/3 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/5" />
                  <Skeleton className="h-4 w-4/5 bg-white/5" />

                  <div className="flex items-center gap-4 pt-2">
                    <Skeleton className="h-4 w-24 bg-white/5" />
                    <Skeleton className="h-4 w-20 bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-32 bg-white/10" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-24 bg-white/5" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <Skeleton className="h-4 w-64 mx-auto bg-white/5" />
          </div>
        </div>
      </footer>
    </div>
  );
}
