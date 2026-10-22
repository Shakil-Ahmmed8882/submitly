import { BaseSkeleton } from "@/components/reusable-components/placeholder/skeletons/BaseSkeleton";

export default function DashboardPageLoading() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <BaseSkeleton className="h-4 w-20" />
        <BaseSkeleton className="h-10 w-72" />
        <BaseSkeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((k) => (
          <BaseSkeleton key={k} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="space-y-2">
        <BaseSkeleton className="h-10 w-full" />
        {[0, 1, 2, 3, 4].map((k) => (
          <BaseSkeleton key={k} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
