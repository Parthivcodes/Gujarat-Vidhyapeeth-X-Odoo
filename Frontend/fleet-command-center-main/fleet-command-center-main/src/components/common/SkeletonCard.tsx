import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24 bg-muted" />
        <Skeleton className="h-8 w-8 rounded-md bg-muted" />
      </div>
      <Skeleton className="mt-3 h-8 w-20 bg-muted" />
      <Skeleton className="mt-2 h-3 w-32 bg-muted" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full rounded-md bg-muted" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md bg-muted/60" />
      ))}
    </div>
  );
}
