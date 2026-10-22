import { PageHeader } from "@/modules/shared/PageHeader";
import SubmitProjectFormSection from "./sections/SubmitProjectFormSection";

export default function SubmitProjectHomeLayout() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        eyebrow="New submission"
        title="Submit your project"
        description="Share your work with your mentor for review and feedback."
      />
      <SubmitProjectFormSection />
    </div>
  );
}
