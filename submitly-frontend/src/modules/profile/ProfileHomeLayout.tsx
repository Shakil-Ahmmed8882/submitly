import { PageHeader } from "@/modules/shared/PageHeader";
import ProfileDetailsSection from "./sections/ProfileDetailsSection";

export default function ProfileHomeLayout() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your account details."
      />
      <ProfileDetailsSection />
    </div>
  );
}
