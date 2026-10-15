import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="glass rounded-[2rem] p-3">
          <Skeleton className="aspect-square rounded-[1.5rem]" />
          <Skeleton className="mx-3 mt-5 h-5 w-2/3" />
          <Skeleton className="mt-5 h-10 rounded-full" />
        </div>
      ))}
    </div>
  );
}
