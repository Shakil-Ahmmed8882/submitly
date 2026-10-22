"use client";

import { BaseSkeleton } from "@/components/reusable-components/placeholder/skeletons/BaseSkeleton";
import { useSession } from "@/modules/auth/services/auth.service.hooks";

type TInfoRowProps = {
  label: string;
  value: string;
  className?: string;
};

export default function ProfileDetailsSection() {
  const { data: user } = useSession();
  if (!user) return <BaseSkeleton className="h-40 w-full rounded-lg" />;

  const { name, email } = user;
  const role = user.role.toLowerCase();

  return (
    <section
      aria-labelledby="profile-details"
      className="rounded-lg bg-card p-5 shadow-card sm:p-6"
    >
      <h2 id="profile-details" className="mb-6 text-base tracking-[-0.02em]">
        Account
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoRow label="Name" value={name} />
        <InfoRow label="Email" value={email} />
        <InfoRow label="Role" value={role} className="capitalize" />
      </div>
    </section>
  );
}

function InfoRow(props: TInfoRowProps) {
  const { label, value, className } = props;
  return (
    <div className="min-w-0 rounded-sm border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 break-words text-sm font-medium ${className ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
