import { BaseSkeleton } from "@/components/reusable-components/placeholder/skeletons/BaseSkeleton";

const ROWS = [0, 1, 2, 3, 4];

export default function SubmissionsTableSkeleton() {
  return (
    <div className="divide-y divide-border rounded-lg bg-card shadow-card">
      {ROWS.map((row) => (
        <div key={row} className="flex items-center gap-4 px-5 py-4">
          <BaseSkeleton className="h-4 flex-1" />
          <BaseSkeleton className="h-4 w-24" />
          <BaseSkeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
