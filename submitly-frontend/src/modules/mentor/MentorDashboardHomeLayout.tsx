import { Suspense } from "react";
import { PageHeader } from "@/modules/shared/PageHeader";
import MentorStatsSection from "./sections/MentorStatsSection";
import SubmissionsTableSection from "./sections/submissions-table/SubmissionsTableSection";
import SubmissionsTableSkeleton from "./sections/submissions-table/SubmissionsTableSkeleton";

export default function MentorDashboardHomeLayout() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Review submissions"
        description="Review student submissions and leave feedback."
      />
      <MentorStatsSection />
      <Suspense fallback={<SubmissionsTableSkeleton />}>
        <SubmissionsTableSection />
      </Suspense>
    </>
  );
}
