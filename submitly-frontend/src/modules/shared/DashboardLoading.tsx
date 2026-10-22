import { BaseSkeleton } from "@/components/reusable-components/placeholder/skeletons/BaseSkeleton";

const SIDEBAR_ITEMS = [0, 1, 2, 3];

export default function DashboardLoading() {
  return (
    <output
      aria-label="Loading workspace"
      className="grid min-h-dvh w-full min-[960px]:grid-cols-[240px_1fr]"
    >
      <div className="hidden space-y-4 border-r border-border p-6 min-[960px]:block">
        <BaseSkeleton className="mb-10 h-8 w-full" />
        {SIDEBAR_ITEMS.map((key) => (
          <BaseSkeleton key={key} className="h-10 w-full" />
        ))}
      </div>
      <div className="space-y-8 p-6">
        <BaseSkeleton className="h-10 w-full" />
        <BaseSkeleton className="h-24 w-full" />
        <div className="grid gap-6 sm:grid-cols-2">
          <BaseSkeleton className="h-72" />
          <BaseSkeleton className="h-72" />
        </div>
      </div>
    </output>
  );
}
