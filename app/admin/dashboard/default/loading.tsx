import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="@container/main w-full space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* SectionCards (4 large summary cards) */}
      <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div>
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" /> {/* Icon placeholder */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics & Insights */}
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid @5xl/main:grid-cols-2 grid-cols-1 gap-4 md:gap-6">
          {/* Chart 1: User Growth (Area) */}
          <Card className="@container/chart">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-50 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-full" />
            </CardFooter>
          </Card>

          {/* Chart 2: Branch Distribution (Pie) */}
          <Card className="@container/chart">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Skeleton className="h-[250px] w-[250px] rounded-full" />
            </CardContent>
            <CardFooter className="flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-20" />
              ))}
            </CardFooter>
          </Card>

          {/* Chart 3: Onboarding Status (Pie) */}
          <Card className="@container/chart">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Skeleton className="h-62.5 w-[250px] rounded-full" />
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardFooter>
          </Card>

          {/* Chart 4: Hourly Activity (Bar) */}
          <Card className="@container/chart">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardFooter>
          </Card>

          {/* Chart 5: Team Growth Radial (Full width) */}
          <Card className="@container/chart col-span-full">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
