import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
       <div className="space-y-4">
         <Skeleton className="h-12 w-full" />
         <Skeleton className="h-12 w-full" />
         <Skeleton className="h-12 w-full" />
       </div>
    </div>
  );
}
