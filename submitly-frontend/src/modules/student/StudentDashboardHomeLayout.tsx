import { PageHeader } from "@/modules/shared/PageHeader";
import MySubmissionsSection from "./sections/MySubmissionsSection";

export default function StudentDashboardHomeLayout() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="My submissions"
        description="All your submitted projects and mentor feedback."
      />
      <MySubmissionsSection />
    </>
  );
}
