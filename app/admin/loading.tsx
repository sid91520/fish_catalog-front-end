import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10" aria-busy="true">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-72 rounded-3xl" />
      <Skeleton className="h-20 rounded-2xl" />
      <Skeleton className="h-20 rounded-2xl" />
    </div>
  );
}
