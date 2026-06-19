import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-3xl border-2 p-0">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <CardContent className="space-y-4 p-6">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="ml-auto h-6 w-20" />
            <Skeleton className="ml-auto h-3 w-16" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Skeleton className="h-10 rounded-full" />
          <Skeleton className="h-10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function RoomsPageSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
}
