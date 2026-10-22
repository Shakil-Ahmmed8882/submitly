import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/types/user.type";
import { InfoRow } from "./InfoRow";
import { ProfileSection } from "./ProfileSection";
import { formatDate } from "./profile.utils";

export function AccountInfoCard({ profile }: { profile: UserProfile }) {
  return (
    <ProfileSection
      title="Account"
      description="Your email is read-only. Account access is resolved by the backend."
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={profile.email} readOnly />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="Role" value={profile.role.replaceAll("_", " ")} />
          <InfoRow label="Member since" value={formatDate(profile.created_at)} />
        </div>
      </div>
    </ProfileSection>
  );
}
